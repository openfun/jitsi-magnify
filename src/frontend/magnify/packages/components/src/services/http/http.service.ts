import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { RefreshTokenResponse } from '../../types';
import { UsersApiRoutes } from '../../utils';
import { DEFAULT_BASE_API_URL } from '../../utils/constants/config';
import { KeycloakService } from '../keycloak';

export const SESSION_ACCESS_TOKEN_KEY = 'access_token';
export const SESSION_REFRESH_ACCESS_TOKEN_KEY = 'refresh_token';
export const getBaseUrl = () => {
  return import.meta.env.REACT_APP_BASE_API_URL ?? DEFAULT_BASE_API_URL;
};

export const buildApiUrl = (route: string) => {
  return `${getBaseUrl()}${route}`;
};

export class HttpService {
  // To know if a particular url has already been retried or not.
  static retry: Map<string, boolean> = new Map<string, boolean>();

  public static setTokens(access?: string, refresh?: string): void {
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

  public static getAccessToken(): string | null {
    return localStorage.getItem(SESSION_ACCESS_TOKEN_KEY);
  }

  public static getRefreshToken(): string | null {
    return localStorage.getItem(SESSION_REFRESH_ACCESS_TOKEN_KEY);
  }

  public static async refreshToken(): Promise<string> {
    const response = await MagnifyAuthApi.post<RefreshTokenResponse>(UsersApiRoutes.REFRESH_TOKEN, {
      refresh: HttpService.getRefreshToken(),
    });
    HttpService.setTokens(response.data.access);
    return response.data.access;
  }
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

MagnifyApi.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = KeycloakService.getToken();
    if (config.headers && token != null) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

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
      await KeycloakService.updateToken();
      return MagnifyApi(originalRequest);
    }
    return Promise.reject(error);
  },
);
