import axios from 'axios';
import { stringify } from 'qs';

import { DEFAULT_GALLERY_ID } from '../reducers/moduleReducer';

export default class FileSystemService {
  config;

  instance;

  constructor() {
    const port = process.env.SERVICE_PORT || 3001;
    const host = process.env.SERVICE_HOST || 'localhost';

    const baseURL = `http://${host}:${port}`;
    this.config = {};
    this.instance = axios.create({
      baseURL,
    });
  }

  fetchModules = async () => {
    return this.instance.get('/', this.config);
  };

  getOauthURL = async moduleId => {
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

  fetchImages = async (moduleId, galleryId, accessToken, offset, before, after, query) => {
    const params = { offset, before, after, query };

    let url = `/${moduleId}?${stringify(params)}`;
    if (galleryId !== DEFAULT_GALLERY_ID) {
      url = `/${moduleId}/gallery/${galleryId}?${stringify(params)}`;
    }

    const config = {
      ...this.config,
      headers: { 'access-token': accessToken },
    };

    return this.instance.get(url, config);
  };
}
