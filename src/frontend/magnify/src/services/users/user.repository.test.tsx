import { MagnifyApi } from '../http/http.service';
import { UsersRepository } from './users.repository';

describe('UserRepository', () => {
  it('it logs in successfully, test if token are well set in Axios', async () => {
    const response = await UsersRepository.login('test', 'test');
    expect(response.auth.access).not.toBe(null);
    expect(response.auth.refresh).not.toBe(null);
    expect(MagnifyApi.defaults.headers.common['Authorization']).toEqual(
      `Bearer ${response.auth.access}`,
    );
  });
  it('it logs out successfully, test if tokens are null', async () => {
    expect(UsersRepository.getAccessToken()).not.toBe(null);
    expect(UsersRepository.getRefreshToken()).not.toBe(null);
    UsersRepository.logout();
    expect(MagnifyApi.defaults.headers.common['Authorization']).toEqual(`Bearer null`);
    expect(UsersRepository.getAccessToken()).toBe(null);
    expect(UsersRepository.getRefreshToken()).toBe(null);
  });
});
