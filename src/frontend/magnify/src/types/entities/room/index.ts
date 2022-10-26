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
