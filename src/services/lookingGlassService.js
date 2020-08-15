import { stringify } from 'qs';

import { DEFAULT_GALLERY_ID } from '../reducers/constants';
import { create } from './axiosInstance';

export default class LookingGlassService {
  config;

  instance;

  constructor() {
    const port = process.env.SERVICE_PORT || 3001;
    const host = process.env.SERVICE_HOST || 'localhost';

    const baseURL = `http://${host}:${port}`;
    this.config = {};
    this.instance = create({
      baseURL,
    });
  }

  fetchModules = async () => {
    return this.instance.get('/', this.config);
  };

  getOauthURL = async (moduleId) => {
    return this.instance.get(`/${moduleId}/oauth`, this.config);
  };

  login = async (moduleId, params) => {
    return this.instance.get(`/${moduleId}/login?${stringify(params)}`, this.config);
  };

  refresh = async (moduleId, refreshToken) => {
    return this.instance.get(`/${moduleId}/refresh?${stringify({ refreshToken })}`, this.config);
  };

  authorize = async (moduleId, code) => {
    return this.instance.get(`/${moduleId}/authorize?${stringify({ code })}`, this.config);
  };

  fetchImages = async (moduleId, galleryId, accessToken, offset, count, after, query, sort, filter) => {
    const params = { offset, count, after, query, sort, filter };
    if (galleryId !== DEFAULT_GALLERY_ID) {
      params.galleryId = galleryId;
    }

    const config = {
      ...this.config,
      headers: { 'access-token': accessToken },
    };

    const url = `/${moduleId}?${stringify(params)}`;
    return this.instance.get(url, config);
  };

  fetchFilters = async (moduleId, filterSectionId, accessToken) => {
    const params = { filter: filterSectionId };

    const config = {
      ...this.config,
      headers: { 'access-token': accessToken },
    };

    const url = `/${moduleId}/filters?${stringify(params)}`;
    return this.instance.get(url, config);
  };

  fetchItemFilters = async (moduleId, itemId, accessToken) => {
    const params = { itemId };

    const config = {
      ...this.config,
      headers: { 'access-token': accessToken },
    };

    const url = `/${moduleId}/filters?${stringify(params)}`;
    return this.instance.get(url, config);
  };
}
