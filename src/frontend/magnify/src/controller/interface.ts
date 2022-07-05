import { Group } from '../types/group';
import { Nullable } from '../types/misc';
import { Profile } from '../types/profile';
import { Room, RoomSettings } from '../types/room';
import { AccessToken, Tokens } from '../types/tokens';
import { Store } from './store';

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
export interface AddGroupsToRoomInput {
  roomSlug: string;
  groupIds: string[];
}

export interface UpdateRoomSettingsInput {
  name: string;
  roomSettings: RoomSettings;
}

export default abstract class Controller {
  _jwt: Nullable<string> = null;
  _setStore: React.Dispatch<React.SetStateAction<Store>> = () => {};

  registerSetStore(setStore: React.Dispatch<React.SetStateAction<Store>>) {
    this._setStore = setStore;
  }

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

  // Groups
  abstract getGroups(): Promise<Group[]>;

  // Meetings
  abstract joinMeeting(meetingId: string): Promise<{ token: string }>;

  // Rooms
  abstract getMyRooms(): Promise<Room[]>;
  abstract registerRoom(roomName: string): Promise<Room>;
  abstract addGroupsToRoom(addGroupsToRoomInput: AddGroupsToRoomInput): Promise<Room>;
  abstract getRoomBySlug(roomSlug: string): Promise<Room>;
  abstract getRoom(roomName: string): Promise<Room>;
  abstract updateRoomSettings(updateRoomSettingsInput: UpdateRoomSettingsInput): Promise<Room>;
}
