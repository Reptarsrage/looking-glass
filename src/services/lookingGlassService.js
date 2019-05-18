import axios from 'axios';
import { stringify } from 'qs';

export default class LookingGlassService {
  instance;

  constructor() {
    const port = process.env.SERVICE_PORT || 3001;
    const host = process.env.SERVICE_HOST || 'localhost';

    const baseURL = `http://${host}:${port}`;
    this.instance = axios.create({
      baseURL,
    });
  }

  async login(params) {
    return await this.instance.get(`/login?${stringify(params)}`);
  }

  async fetchImages(offset, accessToken) {
    const url = `/images?${stringify({ offset })}`;
    const config = {
      headers: { 'access-token': accessToken },
    };

    return await this.instance.get(url, config);
  }
}
