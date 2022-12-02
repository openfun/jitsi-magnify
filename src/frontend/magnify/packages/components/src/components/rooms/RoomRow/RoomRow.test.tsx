import { render, screen } from '@testing-library/react';
import React from 'react';
import createRandomRoom from '../../../factories/rooms';
import { Room } from '../../../types/entities/room';
import { MagnifyTestingProvider } from '../../app';
import { RoomRow } from './RoomRow';

describe('RoomRow', () => {
  it('should render the row indicating that user is admin', async () => {
    const room: Room = createRandomRoom();
    render(<RoomRow baseJitsiUrl={'meeting.education'} room={room} />, {
      wrapper: MagnifyTestingProvider,
    });
    screen.getByText(room.name ?? '');
  });
});
