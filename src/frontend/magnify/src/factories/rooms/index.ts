import { faker } from '@faker-js/faker';
import { Room } from '../../types/entities/room';

export default function createRandomRoom(isAdmin: boolean = true): Room {
  return {
    id: faker.datatype.uuid(),
    name: faker.lorem.slug(),
    slug: faker.lorem.slug(),
    is_administrable: isAdmin,
  };
}
