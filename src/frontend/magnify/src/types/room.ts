import { Group } from './group';

export interface Room {
  id: string;
  name: string;
  isAdmin?: boolean;
  groups: Group[];
}
