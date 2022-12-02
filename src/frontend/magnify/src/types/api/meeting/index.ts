import { Meeting } from '../../entities';

export interface MeetingResponse extends Meeting {}
export interface CreateMeetingData {
  name: string;
}
export interface UpdateMeetingData extends Meeting {}
