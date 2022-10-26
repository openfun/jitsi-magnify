import { faker } from '@faker-js/faker';
import { Room } from '../../types/entities/room';

export default function createRandomRoom(isAdmin: boolean = true): Room {
  const id = faker.datatype.uuid();
  const name = faker.lorem.slug();
  return {
    id: id,
    name: name,
    slug: faker.lorem.slug(),
    is_administrable: isAdmin,
    jitsi: {
      token: '123',
      room: `${name}-${id}`,
    },
  };
}
