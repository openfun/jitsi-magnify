import { faker } from '@faker-js/faker';
import { Room, RoomAccessRole, RoomUserAccesses } from '../../types';

export function createRandomRoom(isAdmin: boolean = true): Room {
  const id = faker.string.uuid();
  const name = faker.lorem.slug();
  const result: Room = {
    id,
    name,
    slug: faker.lorem.slug(),
    is_administrable: isAdmin,
    is_public: false,
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
    id: faker.string.uuid(),
    role: RoomAccessRole.ADMINISTRATOR,
    room: '123',
    user: {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      username: faker.internet.userName(),
      language: 'en',
    },
  };
}
