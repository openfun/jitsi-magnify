import Keycloak from 'keycloak-js';
import { User } from '../../types';
import { Maybe } from '../../types/misc';
import { KEYCLOAK_TOKEN_VALIDITY } from '../../utils/settings';

export interface KeycloakServiceConfig {
  url: string;
  clientId: string;
  realm: string;
}

export class KeycloakService {
  static _kc: Keycloak;

  public static initKeycloak(
    redirectUri: string,
    configuration: KeycloakServiceConfig,
    onAuthenticatedCallback: (isAuth: boolean, user?: User) => void,
  ): void {
    const kcObject = new Keycloak(configuration);

    kcObject
      .init({
        redirectUri: redirectUri,
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
        silentCheckSsoFallback: false,
      })
      .then(async (authenticated) => {
        if (authenticated) {
          await KeycloakService._kc?.loadUserInfo();
        }
        onAuthenticatedCallback(authenticated);
      })
      .catch((error) => {
        onAuthenticatedCallback(false);
      });

    KeycloakService._kc = kcObject;
  }

  public static getToken(): Maybe<string> {
    return KeycloakService._kc?.token;
  }

  public static isLoggedIn(): boolean {
    return !!KeycloakService._kc?.token;
  }

  public static getUsername(): Maybe<string> {
    return KeycloakService._kc?.tokenParsed?.preferred_username;
  }

  public static async updateToken(
    successCallback?: () => void,
    failedCallback?: () => void,
  ): Promise<void> {
    const result = await KeycloakService._kc.updateToken(KEYCLOAK_TOKEN_VALIDITY);
    if (result) {
      successCallback?.();
    } else {
      failedCallback?.();
    }
  }
}
