import Controller from './interface';
import axios, { AxiosInstance } from 'axios';

interface DefaultControllerOptions {
  url: string;
}

export default class DefaultController extends Controller {
  _axios: AxiosInstance;

  constructor(options: DefaultControllerOptions) {
    super();
    this._axios = axios.create({
      baseURL: options.url,
      timeout: 1000,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  async sendTest(message: string): Promise<void> {
    await this._axios.post('/test', { message });
  }
  async getExamples(): Promise<{ id: string; name: string }[]> {
    const res = await this._axios.get('/examples');
    return res.data;
  }

  async joinRoom(roomId: string): Promise<{ token: string }> {
    throw new Error('Not implemented');
  }
}
