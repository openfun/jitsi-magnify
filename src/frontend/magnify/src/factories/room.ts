import { faker } from '@faker-js/faker';
import { Member } from '../types/member';
import { Room, RoomSettings } from '../types/room';
import createRandomGroups from './groups';
import createRandomMeetings from './meetings';

function settings(): (keyof RoomSettings)[] {
  return [
    'chatEnabled',
    'screenSharingEnabled',
    'everyoneStartsMuted',
    'everyoneStartsWithoutCamera',
    'waitingRoomEnabled',
    'askForPassword',
    'askForAuthentication',
  ];
}

export function getRandomSetting(): keyof RoomSettings {
  const allSettings = settings();
  return allSettings[Math.floor(Math.random() * allSettings.length)];
}

export function createRandomRoomSettings(): RoomSettings {
  const randomSettings = settings()
    .sort(() => Math.random() - 0.5)
    .map((elt, index) => [elt, index < 3]);

  return Object.fromEntries(randomSettings);
}

export default function createRandomRoom(isAdmin?: boolean, userToInclude?: Member): Room {
  return {
    id: faker.datatype.uuid(),
    name: faker.lorem.slug(),
    slug: faker.lorem.slug(),
    isAdmin: isAdmin || false,
    groups: createRandomGroups(4, userToInclude),
    meetings: createRandomMeetings(7),
    settings: createRandomRoomSettings(),
  };
}
