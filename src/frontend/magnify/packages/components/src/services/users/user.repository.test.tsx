import { HttpService, MagnifyApi } from '../http/http.service';
import { UsersRepository } from './users.repository';

describe('UserRepository', () => {
  it('it logs in successfully, test if token are well set in Axios', async () => {
    const response = await UsersRepository.login('test', 'test');
    expect(response.auth.access).not.toBe(null);
    expect(response.auth.refresh).not.toBe(null);
  });
  it('it logs out successfully, test if tokens are null', async () => {
    expect(HttpService.getAccessToken()).not.toBe(null);
    expect(HttpService.getRefreshToken()).not.toBe(null);
    UsersRepository.logout();
    expect(MagnifyApi.defaults.headers.common['Authorization']).toEqual(`Bearer null`);
    expect(HttpService.getAccessToken()).toBe(null);
    expect(HttpService.getRefreshToken()).toBe(null);
  });
});
