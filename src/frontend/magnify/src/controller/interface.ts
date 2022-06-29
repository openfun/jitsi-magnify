import { Profile } from '../types/profile';
import { AccessToken, Tokens } from '../types/tokens';

export interface SignupInput {
  name: string;
  email: string;
  username: string;
  password: string;
}
export interface LoginInput {
  username: string;
  password: string;
}
export interface UpdateUserInput {
  id: string;
  name: string;
  email: string;
  username: string;
}
export interface UpdateUserAvatarInput {
  id: string;
  formData: FormData;
}
export interface UpdateUserPasswordInput {
  oldPassword: string;
  newPassword: string;
}

export default abstract class Controller {
  // False routes, just to try the controller mechanism.
  abstract sendTest(message: string): Promise<any>;
  abstract getExamples(): Promise<{ id: string; name: string }[]>;

  // True routes, to be implemented by the controller.
  abstract joinRoom(roomId: string): Promise<{ token: string }>;

  // Login
  abstract login(loginInput: LoginInput): Promise<Tokens>;
  abstract refresh(refresh: string): Promise<AccessToken>;

  // Users
  abstract signup(signupInput: SignupInput): Promise<Tokens>;
  abstract getMyProfile(): Promise<Profile>;
  abstract getUser(id: string): Promise<Profile>;
  abstract updateUser(updateUserInput: UpdateUserInput): Promise<Profile>;
  abstract updateUserAvatar(updateUserAvatarInput: UpdateUserAvatarInput): Promise<Profile>;
  abstract updateUserPassword(updateUserPasswordInput: UpdateUserPasswordInput): Promise<Profile>;
  abstract deleteUser(id: string): Promise<void>;
}
