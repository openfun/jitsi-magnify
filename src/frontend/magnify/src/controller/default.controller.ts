import Controller from './interface';
import axios, { AxiosInstance } from 'axios';

interface IDefaultControllerOptions {
  url: string;
}

export default class DefaultController extends Controller {
  _axios: AxiosInstance;

  constructor(options: IDefaultControllerOptions) {
    super();
    this._axios = axios.create({
      baseURL: options.url,
      timeout: 1000,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  async sendTest(message: string): Promise<any> {
    const res = await this._axios.post('/test', { message });
    return res.data;
  }
}
