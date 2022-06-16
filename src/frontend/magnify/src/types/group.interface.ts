import { Member } from './member.interface';

export interface Group {
  id: string;
  name: string;
  members: Member[];
}
