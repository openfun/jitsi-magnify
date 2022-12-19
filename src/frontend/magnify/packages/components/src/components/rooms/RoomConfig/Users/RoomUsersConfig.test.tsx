import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ResponsiveContext } from 'grommet';
import React from 'react';
import { describe, it, Mock, vi } from 'vitest';

import createRandomRoom from '../../../../factories/rooms';
import { Room } from '../../../../types';
import { ArrayHelper } from '../../../../utils/helpers/array';
import { MagnifyTestingProvider } from '../../../app';
import { RoomUsersConfig } from './RoomUsersConfig';

interface renderRoomUserResponse {
  onDelete: Mock;
  onUpdateRole: Mock;

  room: Room;
  addUser: Mock;

  baseElement: HTMLElement;
  container: HTMLElement;
}

const renderRoomUserConfig = (): renderRoomUserResponse => {
  const onDelete = vi.fn();
  const onUpdateRole = vi.fn();
  const addUser = vi.fn();
  const room = createRandomRoom();

  const { container, baseElement } = render(
    <ResponsiveContext.Provider value={'large'}>
      <RoomUsersConfig
        addUser={addUser}
        onDeleteUser={onDelete}
        onUpdateUser={onUpdateRole}
        room={room}
      />
    </ResponsiveContext.Provider>,
    { wrapper: MagnifyTestingProvider },
  );
  return {
    onDelete,
    onUpdateRole,
    addUser,
    baseElement,
    container,
    room,
  };
};

describe('RoomUsersConfig', () => {
  it('should render successfully', async () => {
    const { room } = renderRoomUserConfig();
    if (room?.user_accesses) {
      await ArrayHelper.resolveAll(room.user_accesses, async (userAccess) => {
        await screen.findByText(userAccess.user.username);
        await screen.findByText(userAccess.user.name);
      });
    }

    await screen.findByRole('button', { name: 'Add a member' });
    await screen.findByText('Members');
  });

  it('click on the add member button, and verify modal is shown', async () => {
    const { baseElement } = renderRoomUserConfig();
    const user = userEvent.setup();

    expect(baseElement.querySelector('#add-room-user')).not.toBeInTheDocument();

    const addMember = await screen.findByRole('button', { name: 'Add a member' });
    await act(() => {
      user.click(addMember);
    });

    await waitFor(async () => {
      expect(baseElement.querySelector('#add-room-user')).toBeInTheDocument();
    });
  });
});
