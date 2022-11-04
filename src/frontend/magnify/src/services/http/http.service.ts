import axios, { AxiosError } from 'axios';

import { RefreshTokenResponse } from '../../types';
import { MAGNIFY_LOCALE_KEY, MagnifyLocales, UsersApiRoutes } from '../../utils';
import { DEFAULT_BASE_API_URL } from '../../utils/constants/config';

export const SESSION_ACCESS_TOKEN_KEY = 'access_token';
export const SESSION_REFRESH_ACCESS_TOKEN_KEY = 'refresh_token';
export const getBaseUrl = () => {
  return process.env.REACT_APP_BASE_API_URL ?? DEFAULT_BASE_API_URL;
};

export const buildApiUrl = (route: string) => {
  return `${getBaseUrl()}${route}`;
};

export const getLocaleStorageLang = (defaultLang: string = MagnifyLocales.EN): string => {
  return localStorage.getItem(MAGNIFY_LOCALE_KEY) ?? defaultLang;
};

export class HttpService {
  // To know if a particular url has already been retried or not.
  static retry: Map<string, boolean> = new Map<string, boolean>();

  public static setTokens(access?: string, refresh?: string): void {
    if (access != null) {
      localStorage.setItem(SESSION_ACCESS_TOKEN_KEY, access);
      MagnifyApi.defaults.headers.common['Authorization'] = `Bearer ${access}`;
    }

    if (refresh != null) {
      localStorage.setItem(SESSION_REFRESH_ACCESS_TOKEN_KEY, refresh);
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

  public static setRequestLanguage(lang: string): void {
    MagnifyApi.defaults.headers.common['Content-Language'] = lang;
    MagnifyApi.defaults.headers.common['Accept-Language'] = lang;
    MagnifyAuthApi.defaults.headers.common['Content-Language'] = lang;
    MagnifyAuthApi.defaults.headers.common['Accept-Language'] = lang;
  }
}

export const MagnifyAuthApi = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-type': 'application/json',
    'Accept-Language': getLocaleStorageLang(),
    'Content-Language': getLocaleStorageLang(),
  },
});

export const MagnifyApi = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-type': 'application/json',
    'Accept-Language': getLocaleStorageLang(),
    'Content-Language': getLocaleStorageLang(),
  },
});

MagnifyApi.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem(
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
      const access_token = await HttpService.refreshToken();
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
