import { rest } from 'msw';
import { server } from '../../mocks/server';
import { UsersApiRoutes } from '../../utils/routes/api/users/usersApiRoutes';
import { buildApiUrl, HttpService } from './http.service';

describe('HttpService', () => {
  const testingRoute = '/test/http-service/';
  beforeEach(() => {
    server.use(
      rest.get(buildApiUrl(testingRoute), (req, res, ctx) => {
        if (req.headers.get('Authorization') === 'Bearer null') {
          return res(ctx.status(401));
        }
        return res(ctx.body('Hello'));
      }),
    );
  });
  it('it sends a request as a logged-out user', async () => {
    server.use(
      rest.post(buildApiUrl(UsersApiRoutes.REFRESH_TOKEN), (req, res, ctx) => {
        return res(ctx.status(401));
      }),
    );
    try {
      await HttpService.MagnifyApi.get(testingRoute);
    } catch (error: any) {
      expect(error.response.status).toEqual(401);
      expect(HttpService.MagnifyApi.defaults.headers.common['Authorization']).toEqual(
        'Bearer null',
      );
    }
  });
  it('it sends a request as a logged user', async () => {
    HttpService.retry.set(testingRoute, false);
    const response = await HttpService.MagnifyApi.get(testingRoute);
    expect(response.data).toEqual('Hello');
    expect(HttpService.MagnifyApi.defaults.headers.common['Authorization']).not.toEqual(
      'Bearer null',
    );
  });
});
