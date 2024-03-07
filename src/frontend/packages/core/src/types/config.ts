import { MagnifyLocales } from '../utils';

export interface MagnifyConfiguration {
  API_URL: string;
  KEYCLOAK_CLIENT_ID: string;
  KEYCLOAK_URL: string;
  KEYCLOAK_EXPIRATION_SECONDS: number;
  MAGNIFY_SHOW_REGISTER_LINK: boolean;
  KEYCLOAK_REALM: string;
  JITSI_DOMAIN: string;
  LANGUAGE_CODE: string;
  LIVEKIT_DOMAIN: string;
}

export const TESTING_CONF: MagnifyConfiguration = {
  API_URL: 'http://localhost:8071/api',
  JITSI_DOMAIN: 'meeting.education',
  KEYCLOAK_CLIENT_ID: 'magnify-front',
  LANGUAGE_CODE: MagnifyLocales.EN,
  MAGNIFY_SHOW_REGISTER_LINK: true,
  KEYCLOAK_EXPIRATION_SECONDS: 1800,
  KEYCLOAK_REALM: 'magnify',
  KEYCLOAK_URL: 'http://localhost:8080',
  LIVEKIT_DOMAIN: 'http:///localhost:7880'
};
