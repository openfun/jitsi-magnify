import { faker } from '@faker-js/faker';
import { Room } from '../../types';
import { Meeting, defaultRecurrenceConfiguration } from '../../types/entities/meeting';

export default function createRandomMeeting(isReccurent = false, room?: Room): Meeting {
  const id = faker.datatype.uuid();
  const name = faker.lorem.slug();
  const startDate = faker.date.between(new Date().toLocaleDateString(), '2030-01-01T00:00:00.000Z');
  const duration = faker.random.numeric(2);

  return {
    id: id,
    name: name,
    room: room,
    startDateTime: startDate,
    expectedDuration: Number(duration),
    jitsi: {
      room: room ? `${room.slug}-${id}` : `${id}`,
      token: '456',
    },
    recurrenceConfiguration: isReccurent ? defaultRecurrenceConfiguration : undefined,
  };
}
