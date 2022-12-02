import { faker } from '@faker-js/faker';
import { Room } from '../../types';
import { Meeting, defaultRecurrenceConfiguration } from '../../types/entities/meeting';

export const createRandomMeeting = (isReccurent = false, room?: Room): Meeting => {
  const id = faker.datatype.uuid();
  const name = faker.lorem.slug();
  const startDateTime = faker.date.between(
    new Date().toLocaleDateString(),
    '2030-01-01T00:00:00.000Z',
  );
  const maxEndDateTime = new Date(startDateTime);
  maxEndDateTime.setHours(maxEndDateTime.getHours() + 5);

  const endDateTime = faker.date.between(startDateTime, maxEndDateTime);

  return {
    id: id,
    name: name,
    room: room,
    startDateTime: startDateTime.toISOString(),
    endDateTime: endDateTime.toISOString(),
    jitsi: {
      room: room ? `${room.slug}-${id}` : `${id}`,
      token: '456',
    },
    recurrenceConfiguration: isReccurent ? defaultRecurrenceConfiguration : undefined,
  };
};
