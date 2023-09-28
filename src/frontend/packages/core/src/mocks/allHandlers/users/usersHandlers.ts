// Disable extraneous dependencies rule because this file is only used in development
/* eslint-disable import/no-extraneous-dependencies */
import { rest } from 'msw';
import { buildApiUrl } from '../../../services/http/http.service';
import { User } from '../../../types';
import { MagnifyLocales } from '../../../utils';
import { UsersApiRoutes } from '../../../utils/routes/api';

export const defaultUserHandler: User = {
  id: '123',
  name: 'John Doe',
  email: 'john.doe@gmail.com',
  username: 'JohnDoe',
  language: MagnifyLocales.EN,
};

export const usersHandlers = [
  rest.get(buildApiUrl(UsersApiRoutes.SEARCH), (req, res, ctx) => {
    return res(ctx.json([defaultUserHandler]));
  }),
];
