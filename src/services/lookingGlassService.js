import qs from 'qs'

import { create } from './axiosInstance'

class LookingGlassService {
  constructor() {
    const port = process.env.SERVICE_PORT || 3001
    const host = process.env.SERVICE_HOST || 'localhost'

    const baseURL = `http://${host}:${port}`
    this.config = {}
    this.instance = create({
      baseURL,
    })
  }

  /**
   * fetches all available modules
   */
  fetchModules = async () => {
    return this.instance.get('/', this.config)
  }

  /**
   * logs user in using basic or implicit authentication
   * @param {string|number} moduleId Module ID
   * @param {string} username Username
   * @param {string} password Password
   */
  login = async (moduleId, username, password) => {
    return this.instance.get(`/${moduleId}/login?${qs.stringify({ username, password })}`, this.config)
  }

  /**
   * logs user in using oauth authentication
   * @param {string|number} moduleId Module ID
   * @param {string} code Code
   */
  authorize = async (moduleId, code) => {
    return this.instance.get(`/${moduleId}/authorize?${qs.stringify({ code })}`, this.config)
  }

  /**
   * refreshes the user's authentication token
   * @param {string|number} moduleId Module ID
   * @param {string} refreshToken Refresh token
   */
  refresh = async (moduleId, refreshToken) => {
    const config = {
      ...this.config,
      headers: { 'refresh-token': refreshToken },
    }

    return this.instance.get(`/${moduleId}/refresh`, config)
  }

  /**
   * fetches a page of items
   * @param {string|number} moduleId Module ID
   * @param {string|number} galleryId Gallery ID
   * @param {string|number} accessToken Authenticated user access token
   * @param {number} offset Offset or page
   * @param {string|number} after Id of an item to use as the anchor point of the page
   * @param {string} query Search query
   * @param {string|number} sort Sort value
   * @param {string|number} filter Filter value
   */
  fetchItems = async (moduleId, galleryId, accessToken, offset, after, query, sort, filters) => {
    const params = { offset, after, query, sort, filters: filters.join(',') }
    if (galleryId) {
      params.galleryId = galleryId
    }

    const config = {
      ...this.config,
      headers: { 'access-token': accessToken },
    }

    return this.instance.get(`/${moduleId}?${qs.stringify(params)}`, config)
  }

  /**
   * fetches a list of available filters by section
   * @param {string|number} moduleId Module ID
   * @param {string|number} filterSectionId Section ID
   * @param {string|number} accessToken Authenticated user access token
   */
  fetchFilters = async (moduleId, filterSectionId, accessToken) => {
    const params = { filter: filterSectionId }
    const config = {
      ...this.config,
      headers: { 'access-token': accessToken },
    }

    const url = `/${moduleId}/filters?${qs.stringify(params)}`
    return this.instance.get(url, config)
  }

  /**
   * fetches a list of filters for the given item
   * @param {string|number} moduleId Module ID
   * @param {string|number} itemId Item ID
   * @param {string|number} accessToken Authenticated user access token
   */
  fetchItemFilters = async (moduleId, itemId, accessToken) => {
    const params = { itemId }
    const config = {
      ...this.config,
      headers: { 'access-token': accessToken },
    }

    const url = `/${moduleId}/filters?${qs.stringify(params)}`
    return this.instance.get(url, config)
  }
}

export default new LookingGlassService()
