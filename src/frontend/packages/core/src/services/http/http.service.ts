import axios, { AxiosError, AxiosInstance } from 'axios';
import { DEFAULT_BASE_API_URL } from '../../utils/constants/config';
import { KeycloakService } from '../keycloak';

export const SESSION_ACCESS_TOKEN_KEY = 'access_token';
export const SESSION_REFRESH_ACCESS_TOKEN_KEY = 'refresh_token';

export class HttpService {
  // To know if a particular url has already been retried or not.
  static retry: Map<string, boolean> = new Map<string, boolean>();

  static baseUrl: string = DEFAULT_BASE_API_URL;

  static MagnifyApi: AxiosInstance;

  static MagnifyAuthApi: AxiosInstance;

  static init(baseUrl: string): void {
    HttpService.baseUrl = baseUrl;
    HttpService.MagnifyAuthApi = axios.create({
      baseURL: baseUrl,
    });
    const api = axios.create({
      baseURL: baseUrl,
      headers: {
        'Content-type': 'application/json',
      },
    });

    api.interceptors.request.use(
      (config) => {
        const token = KeycloakService.getToken();
        if (config.headers && token != null) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    api.interceptors.response.use(
      (response) => {
        HttpService.retry.set(response.config.url + '', false);
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config!;
        const isRetry = HttpService.retry.get(originalRequest.url + '');
        if (error.response?.status === 401 && originalRequest.url && !isRetry) {
          HttpService.retry.set(originalRequest.url, true);
          await KeycloakService.updateToken();
          return HttpService.MagnifyApi(originalRequest);
        }
        return Promise.reject(error);
      },
    );

    HttpService.MagnifyApi = api;
  }

  static buildApiUrl(route: string): string {
    return `${HttpService.baseUrl}${route}`;
  }

  static setTokens(access?: string, refresh?: string): void {
    if (access != null) {
      localStorage.setItem(SESSION_ACCESS_TOKEN_KEY, access);
    } else {
      localStorage.removeItem(SESSION_ACCESS_TOKEN_KEY);
    }

    if (refresh != null) {
      localStorage.setItem(SESSION_REFRESH_ACCESS_TOKEN_KEY, refresh);
    } else {
      localStorage.removeItem(SESSION_REFRESH_ACCESS_TOKEN_KEY);
    }
  }
}

export const buildApiUrl = (route: string): string => {
  return HttpService.buildApiUrl(route);
};
