import { Room } from '../types/room';
import { faker } from '@faker-js/faker';

export default function createRandomRoom(isAdmin?: boolean): Room {
  return {
    id: faker.datatype.uuid(),
    name: faker.lorem.slug(),
    isAdmin: isAdmin || false,
  };
}
