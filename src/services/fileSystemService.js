import { basename, extname } from 'path'
import { lookup } from 'mime-types'
import { stringify, parse } from 'qs'

import Crawler from './directoryCrawler'
import logger from '../logger'

class FileSystemService {
  constructor() {
    let queryString = window.location.search
    if (queryString.startsWith('?')) {
      queryString = queryString.substring(1)
    }

    const queryParams = parse(queryString)
    this.port = queryParams.port
    this.host = 'localhost'
    this.maxCacheSize = 100
    this.cacheItems = []
    this.cacheLookup = {}
  }

  cacheContains = (key) => key in this.cacheLookup

  getCache = (key) => this.cacheLookup[key]

  addCache = (key, value) => {
    this.cacheLookup[key] = value
    if (this.cacheItems.push(key) > this.maxCacheSize) {
      delete this.cacheLookup[this.cacheItems.shift()]
    }
  }

  fetchItems = async (_moduleId, galleryId, _accessToken, offset, _after, _search, sort, filters) => {
    try {
      const dirPath = Buffer.from(galleryId, 'base64').toString('utf-8')
      const cacheKey = `${filters.join('__')}__${sort}___${dirPath}`
      if (!this.cacheContains(cacheKey)) {
        this.addCache(cacheKey, new Crawler(dirPath))
      }

      const crawler = this.getCache(cacheKey)
      const pageNumber = Math.max(offset, 0)
      const page = await crawler.getPage(pageNumber, sort, filters)
      const data = {
        items: page.map(({ file, width, height, isFile, path }) => {
          const title = isFile ? basename(file, extname(file)) : basename(path)
          const isVideo = lookup(file).startsWith('video')
          const isGallery = !isFile
          const url = `http://${this.host}:${this.port}/${isVideo ? 'video' : 'image'}?${stringify({ uri: file })}`

          return {
            id: Buffer.from(path, 'utf-8').toString('base64'),
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
            poster: null,
            isVideo,
            isGallery,
            filters: [],
            date: null,
            source: null,
            author: null,
          }
        }),
        hasNext: page.length > 0,
        offset: pageNumber + 1,
        after: null,
      }

      return { data }
    } catch (err) {
      // deal with the fact the chain failed
      logger.error('Error crawling', err)
      throw err
    }
  }

  fetchFilters = async (_moduleId, filterSectionId) => {
    switch (filterSectionId) {
      case 'fileType':
        return {
          data: [
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
          ],
        }
      case 'contentType':
        return {
          data: [
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
          ],
        }
      default:
        return { data: [] }
    }
  }
}

export default new FileSystemService()
