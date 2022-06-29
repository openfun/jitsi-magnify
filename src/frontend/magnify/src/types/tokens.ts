export interface RefreshToken {
  refresh: string;
}

export interface AccessToken {
  access: string;
}

export type Tokens = RefreshToken & AccessToken;
