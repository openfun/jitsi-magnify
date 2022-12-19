import { MessageDescriptor } from 'react-intl';
import { commonRoomMessages } from '../../../i18n/Messages/Room/commonRoomMessages';
import { User } from '../user';

export interface RoomSettings {
  askForAuthentication?: boolean;
  askForPassword?: boolean;
  roomPassword?: string;
  waitingRoomEnabled?: boolean;
  enableLobbyChat?: boolean;
  startAudioMuted?: boolean;
  startWithVideoMuted?: boolean;
  screenSharingEnabled?: boolean;
}

export interface Room {
  id: string;
  name: string;
  slug: string;
  is_administrable: boolean;
  jitsi: {
    room: string;
    token: string;
  };
  configuration?: RoomSettings;
  user_accesses?: RoomUserAccesses[];
}

export const defaultConfiguration: RoomSettings = {
  askForAuthentication: true,
  askForPassword: false,
  roomPassword: '',
  waitingRoomEnabled: true,
  enableLobbyChat: true,
  startAudioMuted: false,
  startWithVideoMuted: true,
  screenSharingEnabled: true,
};

export interface RoomUserAccesses {
  id: string;
  role: RoomAccessRole;
  room: string;
  user: RoomUser;
}

export interface RoomUser extends Omit<User, 'email'> {}

export enum RoomAccessRole {
  OWNER = 'owner',
  ADMINISTRATOR = 'administrator',
  MEMBER = 'member',
}

export const AllRoomAccessRoles = [
  RoomAccessRole.OWNER,
  RoomAccessRole.ADMINISTRATOR,
  RoomAccessRole.MEMBER,
];

export const roomAccessRoleToTranslation: Record<string, MessageDescriptor> = {
  [RoomAccessRole.OWNER]: commonRoomMessages.role_owner,
  [RoomAccessRole.ADMINISTRATOR]: commonRoomMessages.role_owner,
  [RoomAccessRole.MEMBER]: commonRoomMessages.role_member,
};
