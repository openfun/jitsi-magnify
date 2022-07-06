import { faker } from '@faker-js/faker';
import {
  createMeetingInProgress,
  createMeetingOver,
  createRandomMeeting,
  createRandomSingleMeeting,
} from './meeting';

export default function createRandomMeetings(numberOfMeetings: number) {
  const generators = [
    createRandomSingleMeeting,
    createMeetingInProgress,
    () => createRandomMeeting({ numberOfMeetingPerWeek: faker.datatype.number(7) }),
    createMeetingOver,
    () => createRandomMeeting({ numberOfMeetingPerWeek: faker.datatype.number(7) }),
  ];

  return Array.from({ length: numberOfMeetings }, (_v, i: number) => generators[i % 5]()).sort(
    () => Math.random() - 0.5,
  );
}
