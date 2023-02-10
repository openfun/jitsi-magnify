import { MagnifyLocales } from './constants';

export const KEYCLOAK_TOKEN_VALIDITY = 30;

export const DEFAULT_JITSI_DOMAIN = 'meeting.education';

export const getDefaultLocale = (): string => window.config.LANGUAGE_CODE ?? MagnifyLocales.EN;
