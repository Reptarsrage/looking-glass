import { basename, extname } from 'path';

import { lookup } from 'mime-types';

import Crawler from './directoryCrawler';
import logger from './logger';

class FileSystemService {
  port: number;

  host: string;

  maxCacheSize: number;

  cacheItems: string[];

  cacheLookup: Record<string, Crawler>;

  constructor(port: number) {
    this.port = port;
    this.host = 'localhost';
    this.maxCacheSize = 100;
    this.cacheItems = [];
    this.cacheLookup = {};
  }

  cacheContains = (key: string) => key in this.cacheLookup;

  getCache = (key: string) => this.cacheLookup[key]!;

  addCache = (key: string, value: Crawler) => {
    this.cacheLookup[key] = value;
    if (this.cacheItems.push(key) > this.maxCacheSize) {
      const item = this.cacheItems.shift();
      if (item) delete this.cacheLookup[item];
    }
  };

  fetchItems = async (galleryId: string, offset: number, sort: string, filters: string[]) => {
    try {
      const dirPath = galleryId;
      const cacheKey = `${filters.join('__')}__${sort}___${dirPath}`;
      if (!this.cacheContains(cacheKey)) {
        this.addCache(cacheKey, new Crawler(dirPath));
      }

      const crawler = this.getCache(cacheKey);
      const pageNumber = Math.max(offset, 0);
      const page = await crawler.getPage(pageNumber, sort, filters);
      return {
        items: page.map(({ file, width, height, isFile, path }) => {
          const title = isFile ? basename(file, extname(file)) : basename(path);
          const mimeType = lookup(file);
          const isVideo = typeof mimeType === 'string' && mimeType.startsWith('video');
          const isGallery = !isFile;
          const url = `http://${this.host}:${this.port}/${isVideo ? 'video' : 'image'}?${new URLSearchParams([
            ['uri', file],
          ]).toString()}`;

          return {
            id: path,
            name: title,
            width,
            height,
            urls: [
              {
                url,
                width,
                height,
              },
            ],
            isVideo,
            isGallery,
            filters: [],
          };
        }),
        hasNext: page.length > 0,
        offset: pageNumber + 1,
      };
    } catch (err) {
      // deal with the fact the chain failed
      logger.error('Error crawling', err);
      throw err;
    }
  };

  fetchFilters = async (filterSectionId: string) => {
    switch (filterSectionId) {
      case 'fileType':
        return [
          {
            id: 'type|file',
            filterSectionId: 'fileType',
            name: 'File',
          },
          {
            id: 'type|directory',
            filterSectionId: 'fileType',
            name: 'Directory',
          },
        ];
      case 'contentType':
        return [
          {
            id: 'contentType|image',
            filterSectionId: 'contentType',
            name: 'Image',
          },
          {
            id: 'contentType|video',
            filterSectionId: 'contentType',
            name: 'Video',
          },
        ];
      default:
        return [];
    }
  };
}

export default FileSystemService;
