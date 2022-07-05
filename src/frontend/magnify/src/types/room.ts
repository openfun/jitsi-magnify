import { Group } from './group';
import { Meeting } from './meeting';

export interface RoomSettings {
  chatEnabled?: boolean;
  screenSharingEnabled?: boolean;
  everyoneStartsMuted?: boolean;
  everyoneStartsWithoutCamera?: boolean;
  waitingRoomEnabled?: boolean;
  askForPassword?: boolean;
  askForAuthentication?: boolean;
}

export interface Room {
  id: string;
  name: string;
  isAdmin?: boolean;
  groups: Group[];
  meetings: Meeting[];
  settings: RoomSettings;
}
