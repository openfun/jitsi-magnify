import axios, { AxiosInstance } from 'axios';
import { Group } from '../types/group';
import { Profile } from '../types/profile';
import { Room } from '../types/room';
import { AccessToken, Tokens } from '../types/tokens';
import Controller, {
  AddGroupsToRoomInput,
  CreateMeetingInput,
  LoginInput,
  SignupInput,
  UpdateRoomSettingsInput,
  UpdateUserAvatarInput,
  UpdateUserInput,
  UpdateUserPasswordInput,
} from './interface';
import { WithToken } from '../types/withToken';
import { Meeting } from '../types/meeting';

interface DefaultControllerSettings {
  url: string;
}

export default class DefaultController extends Controller {
  _axios: AxiosInstance;

  constructor(options: DefaultControllerSettings) {
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

  async getGroups(): Promise<Group[]> {
    // GET /groups
    throw new Error('Not implemented');
  }

  async getMeeting(meetingId: string): Promise<WithToken<Meeting>> {
    throw new Error('Not implemented');
  }
  async joinMeeting(): Promise<{ token: string }> {
    throw new Error('Not implemented');
  }
  async createMeeting(createMeetingInput: CreateMeetingInput): Promise<Meeting> {
    throw new Error('Not implemented');
  }

  async getMyRooms(): Promise<Room[]> {
    throw new Error('Not implemented');
  }
  async registerRoom(roomName: string): Promise<Room> {
    throw new Error('Not implemented');
  }
  async addGroupsToRoom({ roomSlug, groupIds }: AddGroupsToRoomInput): Promise<Room> {
    throw new Error('Not implemented');
  }
  async getRoomBySlug(roomSlug: string): Promise<WithToken<Room>> {
    throw new Error('Not implemented');
  }
  async getRoomPossibleMeetings(roomSlug: string): Promise<WithToken<Meeting>[]> {
    throw new Error('Not implemented');
  }
  getRoom(roomName: string): Promise<Room> {
    // GET /rooms/{roomName}
    throw new Error('Not implemented.');
  }
  updateRoomSettings(updateRoomSettingsInput: UpdateRoomSettingsInput): Promise<Room> {
    // PUT /rooms/{roomName}/settings {settings}
    throw new Error('Not implemented.');
  }
}
