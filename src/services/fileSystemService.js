import { basename, extname } from 'path'
import { lookup } from 'mime-types'
import { stringify, parse } from 'qs'

import Crawler from './directoryCrawler'

export default class FileSystemService {
  constructor() {
    let queryString = global.location.search
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

  fetchImages = async (_moduleId, galleryId, _accessToken, offset) => {
    try {
      const dirPath = Buffer.from(galleryId, 'base64').toString('utf-8')
      if (!this.cacheContains(dirPath)) {
        this.addCache(dirPath, new Crawler(dirPath))
      }

      const crawler = this.getCache(dirPath)
      const pageNumber = Math.max(offset, 0)
      const page = await crawler.getPage(pageNumber)
      const data = {
        items: page.map(({ file, width, height, isFile, path }) => {
          const title = isFile ? basename(file, extname(file)) : basename(path)
          const isVideo = lookup(file).startsWith('video')
          const isGallery = !isFile
          const url = `http://${this.host}:${this.port}/${isVideo ? 'video' : 'image'}?${stringify({ uri: file })}`

          return {
            id: Buffer.from(path, 'utf-8').toString('base64'),
            title,
            description: '',
            width,
            height,
            url,
            thumb: null,
            isVideo,
            isGallery,
            filters: [],
          }
        }),
        hasNext: page.length > 0,
        count: page.length,
        offset: pageNumber + 1,
        after: null,
      }

      return { data }
    } catch (err) {
      // Deal with the fact the chain failed
      console.error('Error crawling', err)
      throw err
    }
  }

  fetchFilters = async () => {
    return { data: [] } // TODO: Implement this
  }
}
