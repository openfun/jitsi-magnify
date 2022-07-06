import { Group } from './group';
import { Meeting } from './meeting';

export interface Room {
  id: string;
  name: string;
  isAdmin?: boolean;
  groups: Group[];
  meetings: Meeting[];
}
