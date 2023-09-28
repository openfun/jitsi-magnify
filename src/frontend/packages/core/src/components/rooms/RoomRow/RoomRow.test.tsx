import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { createRandomRoom } from '../../../factories';
import { Room } from '../../../types';
import { MagnifyTestingProvider } from '../../app';
import { RoomRow } from './RoomRow';

describe('RoomRow', () => {
  it('should render the row indicating that user is admin', async () => {
    const room: Room = createRandomRoom();
    render(<RoomRow room={room} />, {
      wrapper: MagnifyTestingProvider,
    });
    screen.getByText(room.name ?? '');
  });
  it('should display notification when link was copied to clipboard', async () => {
    const room: Room = createRandomRoom();
    const user = userEvent.setup();
    render(<RoomRow room={room} />, {
      wrapper: MagnifyTestingProvider,
    });
    await act(() => {
      user.click(screen.getByRole('button', { name: 'Open Menu' }));
    });
    const menuItem = await screen.findByRole('menuitem', { name: 'Clone Copy link' });

    await act(async () => {
      await user.click(menuItem);
    });

    await screen.findByText('Room link copied to clipboard!');
  });
});
