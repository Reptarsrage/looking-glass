import axios from 'axios';
import { stringify } from 'qs';

export default class LookingGlassService {
  constructor() {
    const port = process.env.SERVICE_PORT || 3001;
    const host = process.env.SERVICE_HOST || 'localhost';

    const baseURL = `http://${host}:${port}`;
    this.instance = axios.create({
      baseURL,
    });
  }

  fetchModules = async () => {
    return await this.instance.get('http://localhost:3001/');
  };

  getOauthURL = async moduleId => {
    return await this.instance.get(`/${moduleId}/oauth`);
  };

  login = async (moduleId, params) => {
    return await this.instance.get(`/${moduleId}/login?${stringify(params)}`);
  };

  authorize = async (moduleId, code) => {
    return await this.instance.get(`/${moduleId}/authorize?${stringify({ code })}`);
  };

  fetchImages = async (moduleId, offset, accessToken) => {
    const url = `/${moduleId}?${stringify({ offset })}`;
    const config = {
      headers: { 'access-token': accessToken },
    };

    return await this.instance.get(url, config);
  };
}
