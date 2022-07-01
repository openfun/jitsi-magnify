import { Nullable } from '../types/misc';
import { Profile } from '../types/profile';

export interface Store {
  user: Nullable<Profile>;
  connexionStatus: ConnexionStatus;
}

export enum ConnexionStatus {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
}

export const defaultStore = {
  user: null,
  connexionStatus: ConnexionStatus.CONNECTING,
};
