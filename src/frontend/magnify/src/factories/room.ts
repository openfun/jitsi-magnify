import { Room } from '../types/room';
import { faker } from '@faker-js/faker';
import createRandomGroups from './groups';
import createRandomMeetings from './meetings';

export default function createRandomRoom(isAdmin?: boolean): Room {
  return {
    id: faker.datatype.uuid(),
    name: faker.lorem.slug(),
    isAdmin: isAdmin || false,
    groups: createRandomGroups(4),
    meetings: createRandomMeetings(7),
  };
}
