import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import createRandomRoom from '../../../factories/rooms';
import { Room } from '../../../types/entities/room';
import { MagnifyTestingProvider } from '../../app';
import RoomRow from './RoomRow';

describe('RoomRow', () => {
  it('should render the row indicating that user is admin', async () => {
    const room: Room = createRandomRoom();
    render(<RoomRow baseJitsiUrl={'meeting.education'} room={room} />, {
      wrapper: MagnifyTestingProvider,
    });
    screen.getByText(room.name ?? '');
  });
  it('should display notification when link was copied to clipboard', async () => {
    const room: Room = createRandomRoom();
    const user = userEvent.setup();
    render(<RoomRow baseJitsiUrl={'meeting.education'} room={room} />, {
      wrapper: MagnifyTestingProvider,
    });
    await user.click(screen.getByRole('button', { name: 'Open Menu' }));
    await user.click(screen.getByRole('menuitem', { name: 'Clone Copy link' }));
    await screen.findByText('Room link copied to clipboard!');
  });
});
