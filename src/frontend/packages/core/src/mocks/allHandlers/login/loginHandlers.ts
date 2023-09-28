// Disable extraneous dependencies rule because this file is only used in development
/* eslint-disable import/no-extraneous-dependencies */
import { rest } from 'msw';
import { buildApiUrl } from '../../../services';
import { LoginResponse, RefreshTokenResponse, User, UserResponse } from '../../../types';
import { MagnifyLocales, UsersApiRoutes } from '../../../utils';

export const defaultUser: User = {
  id: '123',
  name: 'John Doe',
  email: 'john.doe@gmail.com',
  username: 'JohnDoe',
  language: MagnifyLocales.EN,
};

export const loginHandlers = [
  rest.post<LoginResponse>(buildApiUrl(UsersApiRoutes.LOGIN), (req, res, ctx) => {
    return res(ctx.json({ auth: { access: 'access_token', refresh: 'refresh_token' } }));
  }),
  rest.post<RefreshTokenResponse>(buildApiUrl(UsersApiRoutes.REFRESH_TOKEN), (req, res, ctx) => {
    return res(ctx.json({ access: 'new_access_token', refresh: 'new_refresh_token' }));
  }),
  rest.get<UserResponse>(buildApiUrl(UsersApiRoutes.ME), (req, res, ctx) => {
    return res(ctx.json(defaultUser));
  }),
];
