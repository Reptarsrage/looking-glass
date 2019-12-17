import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { promisify } from 'util';
import { stringify } from 'qs';
import { exec } from 'child_process';
import imageSizeOfSync from 'image-size';

const imageSizeOf = promisify(imageSizeOfSync);

export default class FileSystemService {
  port = process.env.SERVICE_PORT || 3002;

  salt = null;

  host = process.env.SERVICE_HOST || 'localhost';

  images = ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp'];

  videos = [
    '.3g2',
    '.3gp',
    '.aaf',
    '.asf',
    '.avchd',
    '.avi',
    '.drc',
    '.flv',
    '.m2v',
    '.m4p',
    '.m4v',
    '.mkv',
    '.mng',
    '.mov',
    '.mp2',
    '.mp4',
    '.mpe',
    '.mpeg',
    '.mpg',
    '.mpv',
    '.mxf',
    '.nsv',
    '.ogg',
    '.ogv',
    '.qt',
    '.rm',
    '.rmvb',
    '.roq',
    '.svi',
    '.vob',
    '.webm',
    '.wmv',
    '.yuv',
  ];

  constructor() {
    this.salt = this.genRandomString(6);
  }

  genRandomString = length =>
    crypto
      .randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);

  sha512 = s =>
    crypto
      .createHmac('sha1', this.salt)
      .update(s)
      .digest('base64');

  fileCount = dir =>
    fs
      .readdirSync(dir)
      .map(item => `${dir}${path.sep}${item}`)
      .map(file => fs.lstatSync(file))
      .filter(stat => stat.isFile()).length;

  dirCount = dir =>
    fs
      .readdirSync(dir)
      .map(item => `${dir}${path.sep}${item}`)
      .map(file => fs.lstatSync(file))
      .filter(stat => stat.isDirectory()).length;

  videoSizeOf = async file => {
    return new Promise((resolve, reject) =>
      exec(
        `ffprobe -v error -show_entries stream=width,height -of default=noprint_wrappers=1 "${file}"`,
        (err, stdout) => {
          if (err) {
            console.warn(err, 'ffprobe error:');
            reject(err);
          }

          const width = /width=(\d+)/.exec(stdout);
          const height = /height=(\d+)/.exec(stdout);
          resolve({
            width: parseInt(width[1], 10),
            height: parseInt(height[1], 10),
          });
        }
      )
    );
  };

  getThumbForFile = async file => {
    try {
      if (this.images.some(ext => ext === path.extname(file).toLowerCase())) {
        const dimensions = await imageSizeOf(file);
        return {
          url: file,
          thumb: null,
          isVideo: false,
          width: dimensions.width,
          height: dimensions.height,
        };
      }

      if (this.videos.some(ext => ext === path.extname(file).toLowerCase())) {
        const dimensions = await this.videoSizeOf(file);
        return {
          url: `http://${this.host}:${this.port}/video?${stringify({ uri: file })}`,
          thumb: null,
          isVideo: true,
          width: dimensions.width,
          height: dimensions.height,
        };
      }
    } catch (err) {
      console.warn(err, `Error determine image for file: ${file}`);
    }

    return null;
  };

  getThumbForDir = async dir => {
    let retItem = null;
    try {
      const dirItems = fs.readdirSync(dir);
      for (const item of dirItems) {
        const file = `${dir}${path.sep}${item}`;
        const stat = fs.statSync(file);
        if (stat && stat.isFile) {
          retItem = await this.getThumbForFile(file);
          // Prefer images
          if (retItem !== null && !retItem.isVideo) {
            return retItem;
          }
        }
      }
    } catch (err) {
      console.warn(err, 'Error reading file');
    }

    console.warn('Unable to determine image for dir: ', dir);
    return retItem;
  };

  walk = async (dir, offset = 0, pageSize = 20) => {
    const results = [];

    const dirCount = this.dirCount(dir);
    let dirItems = fs.readdirSync(dir).map(item => `${dir}${path.sep}${item}`);

    // shuffle if contains directories
    if (dirCount > 0) {
      dirItems = dirItems.sort((a, b) => {
        const aHash = this.sha512(a);
        const bHash = this.sha512(b);
        if (aHash === bHash) {
          return 0;
        }
        if (aHash > bHash) {
          return -1;
        }
        return 1;
      });
    }

    for (const itemPath of dirItems.slice(offset, Math.min(offset + pageSize, dirItems.length))) {
      const title = path.basename(itemPath, path.extname(itemPath));
      const stat = fs.statSync(itemPath);
      let result = null;
      if (stat && stat.isDirectory()) {
        console.log('xxxxxxxxx', { itemPath });
        const details = await this.getThumbForDir(itemPath);
        const itemDirCount = this.dirCount(itemPath);
        const itemFileCount = this.fileCount(itemPath);

        result =
          details === null
            ? null
            : {
                ...details,
                id: encodeURIComponent(itemPath),
                title,
                description: itemPath,
                isGallery: itemFileCount > 1 || itemDirCount > 0,
              };
      } else {
        const details = await this.getThumbForFile(itemPath);
        result =
          details === null
            ? null
            : {
                ...details,
                id: this.sha512(itemPath),
                title,
                description: itemPath,
                isGallery: false,
              };
      }

      if (result !== null) {
        results.push(result);
      }
    }

    return {
      items: results,
      hasNext: offset < dirItems.length,
      count: results.length,
      offset: offset + pageSize,
    };
  };

  fetchImages = async (moduleId, galleryId, accessToken, offset) => {
    try {
      // NOTE: our location is the base64 encoded galleryId
      const location = galleryId;
      const pageSize = 20;
      const data = await this.walk(location, offset, pageSize);
      return { data };
    } catch (err) {
      // Deal with the fact the chain failed
      console.warn(err, 'Error crawling');
      throw err;
    }
  };
}
