import { Nullable } from '../types/misc';
import { Profile } from '../types/profile';

export interface Store {
  user: Nullable<Profile>;
}

export const defaultStore = {
  user: null,
};
