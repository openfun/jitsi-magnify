import { MessageDescriptor } from 'react-intl';
import { commonRoomMessages } from '../../../i18n/Messages/Room/commonRoomMessages';
import { User } from '../user';

export interface RoomSettings {
  askForAuthentication?: boolean;
  askForPassword?: boolean;
  roomPassword?: string;
  waitingRoomEnabled?: boolean;
  enableLobbyChat?: boolean;
  startWithAudioMuted?: boolean;
  startWithVideoMuted?: boolean;
  screenSharingEnabled?: boolean;
}

export interface Room {
  id: string;
  name: string;
  slug: string;
  is_administrable: boolean;
  is_public: boolean;
  livekit: {
    room: string;
    token: string;
  };
  configuration?: RoomSettings;
  accesses?: RoomUserAccesses[];
  start_with_audio_muted: boolean,
  start_with_video_muted: boolean
}

export const defaultConfiguration: RoomSettings = {
  askForAuthentication: true,
  askForPassword: false,
  roomPassword: '',
  waitingRoomEnabled: true,
  enableLobbyChat: true,
  startWithAudioMuted: false,
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
