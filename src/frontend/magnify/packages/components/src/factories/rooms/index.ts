import { faker } from '@faker-js/faker';
import { Room, RoomAccessRole, RoomUserAccesses } from '../../types';

export default function createRandomRoom(isAdmin: boolean = true): Room {
  const id = faker.datatype.uuid();
  const name = faker.lorem.slug();
  const result: Room = {
    id: id,
    name: name,
    slug: faker.lorem.slug(),
    is_administrable: isAdmin,
    jitsi: {
      token: '123',
      room: `${name}-${id}`,
    },
  };

  result.accesses = [...Array(5)].map(() => createRoomUserAccesses());

  return result;
}

export function createRoomUserAccesses(): RoomUserAccesses {
  return {
    id: faker.datatype.uuid(),
    role: RoomAccessRole.ADMINISTRATOR,
    room: '123',
    user: {
      id: faker.datatype.uuid(),
      name: faker.name.fullName(),
      username: faker.internet.userName(),
      language: 'en',
    },
  };
}
