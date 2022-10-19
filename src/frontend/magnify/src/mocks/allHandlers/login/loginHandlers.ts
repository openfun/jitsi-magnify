import { rest } from 'msw';
import { buildApiUrl } from '../../../services/http/http.service';
import { LoginResponse, RefreshTokenResponse, UserResponse } from '../../../types/api/auth';
import { User } from '../../../types/entities/user';
import { UsersApiRoutes } from '../../../utils/routes/api/users/usersApiRoutes';

export const defaultUser: User = {
  id: '123',
  name: 'John Doe',
  email: 'john.doe@gmail.com',
  username: 'JohnDoe',
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
