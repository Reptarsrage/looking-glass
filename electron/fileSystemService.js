const { basename, extname } = require("path");
const { lookup } = require("mime-types");

const logger = require("./logger");
const Crawler = require("./directoryCrawler");

class FileSystemService {
  constructor(port) {
    this.port = port;
    this.host = "localhost";
    this.maxCacheSize = 100;
    this.cacheItems = [];
    this.cacheLookup = {};
  }

  cacheContains = (key) => key in this.cacheLookup;

  getCache = (key) => this.cacheLookup[key];

  addCache = (key, value) => {
    this.cacheLookup[key] = value;
    if (this.cacheItems.push(key) > this.maxCacheSize) {
      delete this.cacheLookup[this.cacheItems.shift()];
    }
  };

  fetchItems = async (galleryId, offset, sort, filters) => {
    try {
      const dirPath = galleryId;
      const cacheKey = `${filters.map((filter) => filter.split("|")[0]).join("__")}__${sort}___${dirPath}`;
      if (!this.cacheContains(cacheKey)) {
        this.addCache(cacheKey, new Crawler(dirPath));
      }

      const crawler = this.getCache(cacheKey);
      const pageNumber = Math.max(offset, 0);
      const page = await crawler.getPage(pageNumber, sort, filters);
      return {
        items: page.map(({ file, width, height, isFile, path }) => {
          const title = isFile ? basename(file, extname(file)) : basename(path);
          const isVideo = lookup(file).startsWith("video");
          const isGallery = !isFile;
          const url = `http://${this.host}:${this.port}/${isVideo ? "video" : "image"}?${new URLSearchParams([
            ["uri", file],
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
      logger.error("Error crawling", err);
      throw err;
    }
  };

  fetchFilters = async (filterSectionId) => {
    switch (filterSectionId) {
      case "fileType":
        return [
          {
            id: "type|file",
            filterSectionId: "fileType",
            name: "File",
          },
          {
            id: "type|directory",
            filterSectionId: "fileType",
            name: "Directory",
          },
        ];
      case "contentType":
        [
          {
            id: "contentType|image",
            filterSectionId: "contentType",
            name: "Image",
          },
          {
            id: "contentType|video",
            filterSectionId: "contentType",
            name: "Video",
          },
        ];
      default:
        return [];
    }
  };
}

module.exports = FileSystemService;
