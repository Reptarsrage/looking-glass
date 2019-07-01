const fs = require('fs');
const path = require('path');
const { promisify } = require('util'); // eslint-disable-line import/no-extraneous-dependencies
const { stringify } = require('qs');
const { exec } = require('child_process');
const imageSizeOf = promisify(require('image-size'));

export default class FileSystemService {
  port = process.env.SERVICE_PORT || 3001;
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

  videoSizeOf = async file => {
    return new Promise((resolve, reject) =>
      exec(
        `ffprobe -v error -show_entries stream=width,height -of default=noprint_wrappers=1 \"${file}\"`,
        (err, stdout) => {
          if (err) {
            console.error(err, 'ffprobe error:');
            reject(err);
          }

          var width = /width=(\d+)/.exec(stdout);
          var height = /height=(\d+)/.exec(stdout);
          resolve({
            width: parseInt(width[1]),
            height: parseInt(height[1]),
          });
        }
      )
    );
  };

  getThumbForFile = async file => {
    if (this.images.some(ext => ext === path.extname(file).toLowerCase())) {
      var dimensions = await imageSizeOf(file);
      return {
        imageURL: file,
        thumbURL: file,
        isVideo: false,
        width: dimensions.width,
        height: dimensions.height,
      };
    }

    if (this.videos.some(ext => ext === path.extname(file).toLowerCase())) {
      var dimensions = await this.videoSizeOf(file);
      return {
        videoURL: `http://${this.host}:${this.port}/video?${stringify({ uri: file })}`,
        thumbURL: null,
        isVideo: true,
        width: dimensions.width,
        height: dimensions.height,
      };
    }

    console.warn('Unable to determine image for file: ', file);
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
      /* intentionally blank */
      console.error(err, 'Error reading file');
    }

    console.warn('Unable to determine image for dir: ', dir);
    return retItem;
  };

  walk = async (dir, offset = 0, pageSize = 20) => {
    const results = [];
    const dirItems = fs.readdirSync(dir);
    for (const item of dirItems.slice(offset, Math.min(offset + pageSize, dirItems.length))) {
      const itemPath = `${dir}${path.sep}${item}`;
      const title = path.basename(itemPath, path.extname(itemPath));
      const stat = fs.statSync(itemPath);
      let result = null;
      if (stat && stat.isDirectory()) {
        const details = await this.getThumbForDir(itemPath);
        result =
          details === null
            ? null
            : {
                ...details,
                id: itemPath,
                title,
                description: '',
                isGallery: true,
                galleryId: Buffer.from(itemPath, 'utf8').toString('base64'),
              };
      } else {
        const details = await this.getThumbForFile(itemPath);
        result =
          details === null
            ? null
            : {
                ...details,
                id: itemPath,
                title,
                description: '',
                isGallery: false,
                galleryId: null,
              };
      }

      if (result !== null) {
        results.push(result);
      }
    }

    return {
      images: results,
      hasNext: offset + pageSize < dirItems.length,
      count: results.length,
      offset: offset + pageSize + 1,
    };
  };

  fetchImages = async (moduleId, galleryId, accessToken, offset, before, after, query) => {
    try {
      // NOTE: our location is the base64 encoded galleryId
      const location = Buffer.from(galleryId, 'base64').toString('utf8');
      const pageSize = 20;
      return { data: await this.walk(location, offset - 1, pageSize) };
    } catch (err) {
      // Deal with the fact the chain failed
      console.error(err, 'Error crawling');
      throw err;
    }
  };
}
