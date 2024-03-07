import { MagnifyLocales } from './constants';

export const KEYCLOAK_TOKEN_VALIDITY = 30;

export const getDefaultLocale = (): string => window.config.LANGUAGE_CODE ?? MagnifyLocales.EN;

export const DEFAULT_LIVEKIT_DOMAIN = 'https://livekit.s24-p1-livekit.paris-digital-lab.fr'