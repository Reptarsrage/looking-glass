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
    console.log(this);
    return await this.instance.get('http://localhost:3001/');
  };

  login = async params => {
    return await this.instance.get(`/login?${stringify(params)}`);
  };

  fetchImages = async (offset, accessToken) => {
    const url = `/images?${stringify({ offset })}`;
    const config = {
      headers: { 'access-token': accessToken },
    };

    return await this.instance.get(url, config);
  };
}
