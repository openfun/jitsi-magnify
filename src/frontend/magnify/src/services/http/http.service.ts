import axios, { AxiosError } from 'axios';
import { DEFAULT_BASE_API_URL } from '../../utils/constants/config';
import { UsersRepository } from '../users/users.repository';

export const SESSION_ACCESS_TOKEN_KEY = 'access_token';
export const SESSION_REFRESH_ACCESS_TOKEN_KEY = 'refresh_token';
export const getBaseUrl = () => {
  return process.env.REACT_APP_BASE_API_URL ?? DEFAULT_BASE_API_URL;
};

export const buildApiUrl = (route: string) => {
  return `${getBaseUrl()}${route}`;
};

export class HttpService {
  // To know if a particular url has already been retried or not.
  static retry: Map<string, boolean> = new Map<string, boolean>();
}

export const MagnifyAuthApi = axios.create({
  baseURL: getBaseUrl(),
});

export const MagnifyApi = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-type': 'application/json',
  },
});

MagnifyApi.defaults.headers.common['Authorization'] = `Bearer ${sessionStorage.getItem(
  SESSION_ACCESS_TOKEN_KEY,
)}`;

MagnifyApi.interceptors.response.use(
  (response) => {
    HttpService.retry.set(response.config.url + '', false);
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;
    const isRetry = HttpService.retry.get(originalRequest.url + '');
    if (error.response?.status === 401 && originalRequest.url && !isRetry) {
      HttpService.retry.set(originalRequest.url, true);
      const access_token = await UsersRepository.refreshToken();
      MagnifyApi.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      originalRequest.headers = {
        ...originalRequest.headers,
        ['Authorization']: `Bearer ${access_token}`,
      };
      return MagnifyApi(originalRequest);
    }
    return Promise.reject(error);
  },
);
