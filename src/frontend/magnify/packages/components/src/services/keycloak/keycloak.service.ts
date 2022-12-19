import Keycloak from 'keycloak-js';
import { User } from '../../types';
import { Maybe } from '../../types/misc';
import {
  KEYCLOAK_CLIENT_ID,
  KEYCLOAK_REALM,
  KEYCLOAK_TOKEN_VALIDITY,
  KEYCLOAK_URL,
} from '../../utils/settings';

const _kc = new Keycloak({
  url: KEYCLOAK_URL,
  realm: KEYCLOAK_REALM,
  clientId: KEYCLOAK_CLIENT_ID,
});

const initKeycloak = (
  redirectUri: string,
  onAuthenticatedCallback: (isAuth: boolean, user?: User) => void,
): void => {
  _kc
    .init({
      redirectUri: redirectUri,
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
      silentCheckSsoFallback: false,
    })
    .then((authenticated) => {
      if (authenticated) {
        _kc.loadUserInfo().then((value) => {});
      }
      onAuthenticatedCallback(authenticated);
    })
    .catch((error) => {
      onAuthenticatedCallback(false);
    });
};

const updateToken = (successCallback?: () => void, failedCallback?: () => void): void => {
  _kc
    .updateToken(KEYCLOAK_TOKEN_VALIDITY)
    .then(() => successCallback?.())
    .catch(() => failedCallback?.());
};

const doLogin = _kc.login;

const doLogout = _kc.logout;

const getToken = () => _kc.token;

const isLoggedIn = () => !!_kc.token;

const getUsername = () => _kc.tokenParsed?.preferred_username;

export interface KeycloakServiceInterface {
  initKeycloak: any;
  doLogin: any;
  doLogout: any;
  isLoggedIn: () => boolean;
  getToken: () => Maybe<string>;
  updateToken: (success?: any, failed?: () => void) => void;
  getUsername: () => Maybe<string>;
  _kc: Keycloak;
}

export const KeycloakService: KeycloakServiceInterface = {
  initKeycloak,
  doLogin,
  doLogout,
  isLoggedIn,
  getToken,
  updateToken,
  getUsername,
  _kc,
};
