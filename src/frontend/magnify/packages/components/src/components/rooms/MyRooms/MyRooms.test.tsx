import Keycloak from 'keycloak-js';
import React from 'react';
import { beforeAll, expect, vi } from 'vitest';
import createRandomRoom from '../../../factories/rooms';
import * as services from '../../../services';
import { render, screen } from '../../../utils/test-utils';

import { MyRooms } from './MyRooms';
const mockDefaultKeyC = {
  initKeycloak: vi.fn(),
  doLogin: vi.fn(),
  doLogout: vi.fn(),
  isLoggedIn: () => true,
  getToken: vi.fn(),
  updateToken: vi.fn(),
  getUsername: vi.fn(),
  _kc: new Keycloak(),
};

describe('MyRooms with connected user', () => {
  beforeAll(() => {
    vi.spyOn(services, 'KeycloakService', 'get').mockReturnValue(mockDefaultKeyC);
  });

  it('should render successfully', async () => {
    const rooms = [createRandomRoom()];
    render(<MyRooms baseJitsiUrl="" rooms={rooms} />);

    // 3) Check the rooms
    expect(screen.getAllByRole('button', { name: 'Join' }).length).toBe(1);
  });
  it('should display message when rooms list is emty', async () => {
    render(<MyRooms baseJitsiUrl="" rooms={[]} />);

    await screen.findByText(
      'No room was created yet. Click on the button " + Room" to create one.',
    );
  });
});

describe('MyRooms with not connected user', () => {
  beforeAll(() => {
    vi.spyOn(services, 'KeycloakService', 'get').mockReturnValue({
      ...mockDefaultKeyC,
      isLoggedIn: () => false,
    });
  });

  it('should render successfully', async () => {
    const rooms = [createRandomRoom()];
    render(<MyRooms baseJitsiUrl="" rooms={rooms} />);
    await screen.findByText('Claiming a room');
  });
});
