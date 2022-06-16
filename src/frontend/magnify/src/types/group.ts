import { Member } from './member';

export interface Group {
  id: string;
  name: string;
  members: Member[];
}
