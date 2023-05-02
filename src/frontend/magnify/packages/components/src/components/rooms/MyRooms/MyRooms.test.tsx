import { screen } from '@testing-library/react';
import React from 'react';
import { beforeAll, expect, vi } from 'vitest';
import createRandomRoom from '../../../factories/rooms';
import { KeycloakService } from '../../../services';
import { renderWrappedInTestingProvider } from '../../../utils/test-utils';

import { MyRooms } from './MyRooms';

describe('MyRooms with connected user', () => {
  beforeAll(() => {
    KeycloakService.isLoggedIn = vi.fn().mockReturnValue(true);
  });

  it('should render successfully', async () => {
    const rooms = [createRandomRoom()];
    renderWrappedInTestingProvider(<MyRooms baseJitsiUrl="" rooms={rooms} />);

    // 3) Check the rooms
    expect(screen.getAllByRole('button', { name: 'Join' }).length).toBe(1);
  });
  it('should display message when rooms list is emty', async () => {
    renderWrappedInTestingProvider(<MyRooms baseJitsiUrl="" rooms={[]} />);

    await screen.findByText(
      'No room was created yet. Click on the button " + Room" to create one.',
    );
  });
});

describe('MyRooms with not connected user', () => {
  beforeAll(() => {
    KeycloakService.isLoggedIn = vi.fn().mockReturnValue(false);
  });

  it('should render successfully', async () => {
    const rooms = [createRandomRoom()];
    renderWrappedInTestingProvider(<MyRooms baseJitsiUrl="" rooms={rooms} />);
    await screen.findByText('Claiming a room');
  });
});
