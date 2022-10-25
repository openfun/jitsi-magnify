import { faker } from '@faker-js/faker';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Room } from '../../../types';
import { MagnifyTestingProvider } from '../../app';
import RoomRow from './RoomRow';

describe('RoomRow', () => {
  it('should render the row indicating that user is admin', async () => {
    const room: Room = {
      id: faker.datatype.uuid(),
      name: faker.lorem.slug(),
      slug: faker.lorem.slug(),
      is_administrable: true,
    };
    render(<RoomRow baseJitsiUrl={'meeting.education'} room={room} />, {
      wrapper: MagnifyTestingProvider,
    });
    screen.getByText(room.name ?? '');
  });
});
