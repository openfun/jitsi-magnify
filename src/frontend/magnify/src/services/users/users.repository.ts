import { User } from '../../types';
import { LoginResponse, SignUpData, UpdateUserData, UserResponse } from '../../types/api/auth';
import { UsersApiRoutes } from '../../utils/routes/api/users/usersApiRoutes';
import {
  HttpService,
  MagnifyApi,
  MagnifyAuthApi,
  SESSION_ACCESS_TOKEN_KEY,
  SESSION_REFRESH_ACCESS_TOKEN_KEY,
} from '../http/http.service';
import { RoutesBuilderService } from '../routes/RoutesBuilder.service';

export class UsersRepository {
  public static async login(username: string, password: string): Promise<LoginResponse> {
    const response = await MagnifyAuthApi.post<LoginResponse>(UsersApiRoutes.LOGIN, {
      username,
      password,
    });
    HttpService.setTokens(response.data.auth.access, response.data.auth.refresh);
    return response.data;
  }

  public static logout(): void {
    localStorage.removeItem(SESSION_REFRESH_ACCESS_TOKEN_KEY);
    localStorage.removeItem(SESSION_ACCESS_TOKEN_KEY);
    MagnifyApi.defaults.headers.common['Authorization'] = `Bearer ${null}`;
  }

  public static async get(userId: string): Promise<User> {
    const url = RoutesBuilderService.build(UsersApiRoutes.GET, { id: userId });
    const response = await MagnifyApi.get<UserResponse>(url);
    return response.data;
  }

  public static async signIn(data?: SignUpData): Promise<UserResponse> {
    const response = await MagnifyAuthApi.post<UserResponse>(UsersApiRoutes.CREATE, data);
    return response.data;
  }

  public static async me(): Promise<UserResponse | undefined> {
    const response = await MagnifyApi.get<UserResponse>(UsersApiRoutes.ME);
    return response.data;
  }

  public static async update(userId: string, updatedData: UpdateUserData): Promise<UserResponse> {
    const url = RoutesBuilderService.build(UsersApiRoutes.UPDATE, { id: userId });
    const response = await MagnifyApi.patch<UserResponse>(url, updatedData);
    return response.data;
  }

  public static async changePassword(
    current_password: string,
    new_password: string,
  ): Promise<UserResponse> {
    const response = await MagnifyApi.post<UserResponse>(UsersApiRoutes.CHANGE_PASSWORD, {
      current_password,
      new_password,
    });
    return response.data;
  }

  public static async delete(updatedData: UpdateUserData, userId: string): Promise<void> {
    const url = RoutesBuilderService.build(UsersApiRoutes.DELETE, { id: userId });
    await MagnifyApi.delete<UserResponse>(url);
  }
}
