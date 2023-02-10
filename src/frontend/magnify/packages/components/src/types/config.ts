import { MagnifyLocales } from '../utils';

export interface MagnifyConfiguration {
  API_URL: string;
  KEYCLOAK_CLIENT_ID: string;
  KEYCLOAK_URL: string;
  KEYCLOAK_EXPIRATION_SECONDS: number;
  KEYCLOAK_REALM: string;
  JITSI_DOMAIN: string;
  LANGUAGE_CODE: string;
}

export const TESTING_CONF: MagnifyConfiguration = {
  API_URL: 'http://localhost:8071/api',
  JITSI_DOMAIN: 'meeting.education',
  KEYCLOAK_CLIENT_ID: 'magnify-front',
  LANGUAGE_CODE: MagnifyLocales.EN,
  KEYCLOAK_EXPIRATION_SECONDS: 1800,
  KEYCLOAK_REALM: 'magnify',
  KEYCLOAK_URL: 'http://localhost:8080',
};
