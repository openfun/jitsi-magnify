import Controller, {
  LoginInput,
  SignupInput,
  UpdateUserAvatarInput,
  UpdateUserInput,
  UpdateUserPasswordInput,
} from './interface';
import axios, { AxiosInstance } from 'axios';
import { AccessToken, Tokens } from '../types/tokens';
import { Profile } from '../types/profile';

interface DefaultControllerOptions {
  url: string;
}

export default class DefaultController extends Controller {
  _axios: AxiosInstance;

  constructor(options: DefaultControllerOptions) {
    super();
    this._axios = axios.create({
      baseURL: options.url,
      timeout: 1000,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  async sendTest(message: string): Promise<void> {
    await this._axios.post('/test', { message });
  }
  async getExamples(): Promise<{ id: string; name: string }[]> {
    const res = await this._axios.get('/examples');
    return res.data;
  }

  async joinRoom(roomId: string): Promise<{ token: string }> {
    throw new Error('Not implemented');
  }
  async login({ username, password }: LoginInput): Promise<Tokens> {
    // POST /login {username, password}
    throw new Error('Not implemented');
  }
  async signup({ email, name, password, username }: SignupInput): Promise<Tokens> {
    // POST /users {name, email, username, password}
    throw new Error('Not implemented');
  }
  async refresh(refresh: string): Promise<AccessToken> {
    // POST /login/refresh {refresh}
    throw new Error('Not implemented');
  }
  async getMyProfile(): Promise<Profile> {
    // GET /users/me
    throw new Error('Not implemented');
  }
  async getUser(id: string): Promise<Profile> {
    // GET /users/{id}
    throw new Error('Not implemented');
  }
  async updateUser({ id, email, name, username }: UpdateUserInput): Promise<Profile> {
    // PUT /users/{id} {name, email, username}
    throw new Error('Not implemented');
  }
  async updateUserAvatar({ id, formData }: UpdateUserAvatarInput): Promise<Profile> {
    // PUT /users/{id}/avatar
    // formData (avatar)
    throw new Error('Not implemented');
  }
  async updateUserPassword({
    newPassword,
    oldPassword,
  }: UpdateUserPasswordInput): Promise<Profile> {
    // PUT /users/{id}/password {old_password, new_password}
    throw new Error('Not implemented');
  }
  async deleteUser(id: string): Promise<void> {
    // DELETE /users/{id}
    throw new Error('Not implemented');
  }
}
