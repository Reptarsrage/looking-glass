import { exec } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import pathModule from 'node:path';
import { promisify } from 'node:util';

import PromisePool from '@mixmaxhq/promise-pool';
import imageSizeOfSync from 'image-size';
import mimeTypes from 'mime-types';

import logger from './logger';

// get dimensions of an image file
const imageSizeOf = promisify(imageSizeOfSync);

type Size = { width: number; height: number };

interface FileItem {
  path: string;
  isFile: boolean;
  size: number;
  mtimeMs: number;
  birthtimeMs: number;
  name: string;
}

interface Item {
  file: string;
  isFile: boolean;
  path: string;
  width: number;
  height: number;
}

// get dimensions of a video file using ffprobe
function videoSizeOf(fPath: string): Promise<Size> {
  const widthReg = /width=(\d+)/;
  const heightReg = /height=(\d+)/;

  return new Promise<Size>((resolve, reject) =>
    exec(
      `ffprobe -v error -show_entries stream=width,height -of default=noprint_wrappers=1 "${fPath}"`,
      (err, stdout) => {
        if (err) {
          logger.error('ffprobe error:', err);
          reject(err);
          return;
        }

        const width = widthReg.exec(stdout);
        const height = heightReg.exec(stdout);

        if (!width || !height) {
          logger.error('ffprobe error: Cant determine width or height');
          reject(new Error('Cant determine width or height'));
          return;
        }

        resolve({
          width: parseInt(width[1]!, 10),
          height: parseInt(height[1]!, 10),
        });
      }
    )
  );
}

async function getThumbnailForDirectory(rootPath: string, filters: string[]): Promise<string | null> {
  // search all directories recursively until a file that can be shown is found
  const contentTypeFilters = filters.filter((text) => text.startsWith('contentType'));
  const imagesAllowed = contentTypeFilters.length === 0 || contentTypeFilters[0] === 'contentType|image';
  const videosAllowed = contentTypeFilters.length === 0 || contentTypeFilters[0] === 'contentType|video';
  const queue = [rootPath];
  while (queue.length > 0) {
    const dirPath = queue.shift();
    if (dirPath === undefined) {
      continue;
    }

    try {
      // loop over all directory items
      const dir = await fs.promises.opendir(dirPath);
      for await (const dirent of dir) {
        // if file, check for correct type
        if (dirent.isFile()) {
          const type = mimeTypes.lookup(dirent.name);
          if (type && ((type.startsWith('image') && imagesAllowed) || (type.startsWith('video') && videosAllowed))) {
            return pathModule.join(dirPath, dirent.name);
          }
        }

        // if directory, enqueue it
        if (dirent.isDirectory()) {
          queue.push(pathModule.join(dirPath, dirent.name));
        }
      }
    } catch {
      /* expected for system volumes */
    }
  }

  return null;
}

/* sort by:
 * none
 * name: dirent.name
 * size: stats.size
 * modified: stats.mtimeMs
 * created: stats.birthtimeMs
 * random
 */

// gets all files in a directory
async function getFiles(dirPath: string, sort: string, filters: string[]): Promise<FileItem[]> {
  const dir = await fs.promises.opendir(dirPath);
  const typeFilters = filters.filter((text) => text.startsWith('type'));
  const filesAllowed = typeFilters.length === 0 || typeFilters[0] !== 'type|file';
  const directoriesAllowed = typeFilters.length === 0 || typeFilters[0] !== 'type|directory';

  const items = [];
  for await (const dirent of dir) {
    const path = pathModule.join(dirPath, dirent.name);
    const { size, mtimeMs, birthtimeMs } = await fs.promises.stat(path);

    if (dirent.isFile() && directoriesAllowed) {
      items.push({ path, isFile: true, size, mtimeMs, birthtimeMs, name: dirent.name });
    } else if (dirent.isDirectory() && filesAllowed) {
      items.push({ path, isFile: false, size, mtimeMs, birthtimeMs, name: dirent.name });
    }
  }

  switch (sort) {
    case 'name':
      items.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'size':
      items.sort((a, b) => a.size - b.size);
      break;
    case 'modified':
      items.sort((a, b) => a.mtimeMs - b.mtimeMs);
      break;
    case 'created':
      items.sort((a, b) => a.birthtimeMs - b.birthtimeMs);
      break;
    case 'random':
      items.sort(() => Math.random() - Math.random());
      break;
    default:
      break;
  }

  return items;
}

// dummy function for callbacks
const dummy = () => [];

class Crawler {
  directory: string;

  done: boolean;

  started: boolean;

  resolved: string[];

  resolvedLookup: Record<string, Item>;

  start: number;

  end: number;

  pageSize: number;

  promiseResolve: (value: Item[] | PromiseLike<Item[]>) => void;

  promiseReject: () => void;

  pool: PromisePool;

  constructor(directory: string) {
    this.directory = directory;
    this.done = false;
    this.started = false;
    this.resolved = [];
    this.resolvedLookup = {};
    this.start = 0;
    this.end = 0;
    this.pageSize = 100;

    this.promiseResolve = dummy;
    this.promiseReject = dummy;

    const cpuCount = os.cpus().length;
    const numConcurrent = cpuCount;
    this.pool = new PromisePool({ numConcurrent });
  }

  getPage = async (page: number, sort: string, filters: string[]): Promise<Item[]> => {
    this.start = page * this.pageSize;
    this.end = this.start + this.pageSize;

    // start, if not already
    if (!this.started) {
      const pagePromise = new Promise<Item[]>((resolve, reject) => {
        this.promiseResolve = resolve;
        this.promiseReject = reject;
      });

      this.started = true;
      this.getDimensionsForDirectory(sort, filters);
      return pagePromise;
    }

    // if done, return requested page
    if (this.done) {
      if (this.start >= this.resolved.length) {
        return [];
      }

      return this.resolve();
    }

    // return page if available
    if (this.end < this.resolved.length) {
      return this.resolve();
    }

    // wait for requested page to be finished
    const pagePromise = new Promise<Item[]>((resolve, reject) => {
      this.promiseResolve = resolve;
      this.promiseReject = reject;
    });

    return pagePromise;
  };

  resolve = () => this.resolved.slice(this.start, this.end).map((file) => this.resolvedLookup[file]!);

  markComplete = (item?: Item) => {
    if (!item) {
      this.done = true;
      this.promiseResolve(this.resolve());
      return;
    }

    this.resolved.push(item.file);
    this.resolvedLookup[item.file] = item;
    if (this.resolved.length === this.end) {
      this.promiseResolve(this.resolve());
    }
  };

  getDimensions = async (item: FileItem, filters: string[]) => {
    const { path, isFile } = item;
    let file: string | null = path;

    if (!isFile) {
      file = await getThumbnailForDirectory(path, filters);
    }

    // check if we were successful in finding a suitable file
    if (!file) {
      return;
    }

    try {
      let size: Size;
      const type = mimeTypes.lookup(file);
      const contentTypeFilters = filters.filter((text) => text.startsWith('contentType'));
      const imagesAllowed = contentTypeFilters.length === 0 || contentTypeFilters[0] === 'contentType|image';
      const videosAllowed = contentTypeFilters.length === 0 || contentTypeFilters[0] === 'contentType|video';

      if (type && type.startsWith('image') && imagesAllowed) {
        const result = await imageSizeOf(file);
        if (result && result.width && result.height) {
          size = { width: result.width, height: result.height };
          this.markComplete({ file, ...size, isFile, path });
        } else {
          throw Error('Unable to determine image size');
        }
      } else if (type && type.startsWith('video') && videosAllowed) {
        size = await videoSizeOf(file);
        this.markComplete({ file, ...size, isFile, path });
      } else if (!imagesAllowed || !videosAllowed) {
        // TODO: log?
        logger.warn('Unable to measure file', file);
        return;
      }
    } catch (err) {
      logger.error('Error getting file dimensions', err);
    }
  };

  getDimensionsForDirectory = async (sort: string, filters: string[]) => {
    const items = await getFiles(this.directory, sort, filters);
    for (const item of items) {
      await this.pool.start(() => this.getDimensions(item, filters));
    }

    await this.pool.flush();
    this.markComplete();
  };
}

export default Crawler;
