import { Room } from '../room';

type recurrence = 'daily' | 'weekly' | 'monthly' | 'yearly';
type monthlyTypeChoice = 'date_day' | 'nth_day';

export interface RecurrentMeetingSettings {
  recurrence?: recurrence;
  frequency?: number;
  recurringUntil?: Date;
  nbOccurrences?: number;
  weekdays?: string;
  monthlyType?: monthlyTypeChoice;
}

export interface Meeting {
  id: string;
  name: string;
  room?: Room;
  startDateTime: Date;
  expectedDuration: number;
  jitsi: {
    room: string;
    token: string;
  };
  recurrenceConfiguration?: RecurrentMeetingSettings;
}

export const defaultRecurrenceConfiguration: RecurrentMeetingSettings = {
  recurrence: 'monthly',
  frequency: 1,
  recurringUntil: new Date(2025, 1, 1),
  nbOccurrences: 1,
  weekdays: '01234',
  monthlyType: 'date_day',
};
