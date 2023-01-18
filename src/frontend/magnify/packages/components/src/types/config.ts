export interface MagnifyConfiguration {
  API_URL: string;
  KEYCLOAK_CLIENT_ID: string;
  KEYCLOAK_URL: string;
  KEYCLOAK_EXPIRATION_SECONDS: number;
  KEYCLOAK_REALM: string;
  JITSI_DOMAIN: string;
}

export const TESTING_CONF: MagnifyConfiguration = {
  API_URL: 'http://localhost:8071/api',
  JITSI_DOMAIN: 'meeting.education',
  KEYCLOAK_CLIENT_ID: 'magnify-front',
  KEYCLOAK_EXPIRATION_SECONDS: 1800,
  KEYCLOAK_REALM: 'magnify',
  KEYCLOAK_URL: 'http://localhost:8080',
};
