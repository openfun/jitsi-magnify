import { User } from '../../entities/user';

export interface LoginResponse {
  msg: string;
  auth: {
    access: string;
    refresh: string;
  };
}

export interface RefreshTokenResponse {
  access: string;
  refresh: string;
}

export interface SignUpData {
  username: string;
  email: string;
  password: string;
  name?: string;
  language?: string;
}

export interface UpdateUserData {
  name: string;
}

export interface UserResponse extends User {}
