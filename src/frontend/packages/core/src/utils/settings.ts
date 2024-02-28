import { MagnifyLocales } from './constants';

export const KEYCLOAK_TOKEN_VALIDITY = 30;

export const getDefaultLocale = (): string => window.config.LANGUAGE_CODE ?? MagnifyLocales.EN;

export const DEFAULT_LIVEKIT_DOMAIN = 'http://51.68.86.104:7880'