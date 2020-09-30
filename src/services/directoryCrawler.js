const PromisePool = require('@mixmaxhq/promise-pool');
const fs = require('fs');
const path = require('path');
const mimeTypes = require('mime-types');
const { promisify } = require('util');
const imageSizeOfSync = require('image-size');
const { exec } = require('child_process');
const os = require('os');

// Get dimensions of an image file
const imageSizeOf = promisify(imageSizeOfSync);

// Get dimensions of a video file using ffprobe
function videoSizeOf(fPath) {
  const widthReg = /width=(\d+)/;
  const heightReg = /height=(\d+)/;

  return new Promise((resolve, reject) =>
    exec(
      `ffprobe -v error -show_entries stream=width,height -of default=noprint_wrappers=1 "${fPath}"`,
      (err, stdout) => {
        if (err) {
          console.error('ffprobe error:', err);
          reject(err);
        }

        const width = widthReg.exec(stdout);
        const height = heightReg.exec(stdout);
        resolve({
          width: parseInt(width[1], 10),
          height: parseInt(height[1], 10),
        });
      }
    )
  );
}

// Gets all files in a directory
async function* getFiles(dirPath) {
  const dir = await fs.promises.opendir(dirPath);
  for await (const dirent of dir) {
    if (dirent.isFile) {
      yield path.join(dirPath, dirent.name);
    }
  }
}

// Dummy function for callbacks
function dummy() {}

module.exports = class crawler {
  constructor(directory) {
    this.directory = directory;
    this.done = false;
    this.started = false;
    this.resolved = [];
    this.resolvedLookup = {};
    this.start = 0;
    this.end = 0;
    this.pageSize = 20;

    this.promiseResolve = dummy;
    this.promiseReject = dummy;

    const cpuCount = os.cpus().length;
    const numConcurrent = cpuCount;
    this.pool = new PromisePool({ numConcurrent });
  }

  getPage = async (page) => {
    this.start = page * this.pageSize;
    this.end = this.start + this.pageSize;

    // Start, if not already
    if (!this.started) {
      const pagePromise = new Promise((resolve, reject) => {
        this.promiseResolve = resolve;
        this.promiseReject = reject;
      });

      this.started = true;
      this.getDimensionsForDirectory();
      return pagePromise;
    }

    // If done, return requested page
    while (this.done) {
      if (this.start >= this.resolved.length) {
        return [];
      }

      return this.resolve();
    }

    // Return page if available
    if (this.end < this.resolved.length) {
      return this.resolve();
    }

    // Wait for requested page to be finished
    const pagePromise = new Promise((resolve, reject) => {
      this.promiseResolve = resolve;
      this.promiseReject = reject;
    });

    return pagePromise;
  };

  resolve = () => this.resolved.slice(this.start, this.end).map((file) => this.resolvedLookup[file]);

  markComplete = (file, size) => {
    if (file === null) {
      this.done = true;
      this.promiseResolve(this.resolve());
      return;
    }

    this.resolved.push(file);
    this.resolvedLookup[file] = { file, ...size };
    if (this.resolved.length === this.end) {
      this.promiseResolve(this.resolve());
    }
  };

  getDimensions = async (file) => {
    try {
      let size;
      const type = mimeTypes.lookup(file);
      if (type && type.startsWith('image')) {
        size = await imageSizeOf(file);
      } else if (type && type.startsWith('video')) {
        size = await videoSizeOf(file);
      } else {
        // TODO: log?
        console.warn('Unable to measure file', file);
        return;
      }

      this.markComplete(file, size);
    } catch (err) {
      console.error('Error getting file dimensions', err);
    }
  };

  getDimensionsForDirectory = async () => {
    for await (const file of getFiles(this.directory)) {
      await this.pool.start(() => this.getDimensions(file));
    }

    await this.pool.flush();
    this.markComplete(null);
  };
};
