import { Maybe } from '../types/misc';

export {};
declare global {
  interface Window {
    config: {
      API_URL: string;
      KEYCLOAK_CLIENT_ID: string;
      KEYCLOAK_URL: string;
      KEYCLOAK_EXPIRATION_SECONDS: number;
      MAGNIFY_SHOW_REGISTER_LINK: boolean;
      LANGUAGE_CODE: Maybe<string>;
      KEYCLOAK_REALM: string;
      JITSI_DOMAIN: string;
    };
  }
}

window.config = window.config || {};
