import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResponsiveContext } from 'grommet';
import React from 'react';
import { describe, expect, it, Mock, vi } from 'vitest';
import createRandomUser from '../../../../../factories/users';
import { RoomAccessRole, RoomUser } from '../../../../../types';
import { MagnifyTestingProvider } from '../../../../app';
import { RoomUsersConfigRow } from './RoomUsersConfigRow';

interface renderRoomUserResponse {
  onDelete: Mock;
  onUpdateRole: Mock;
  user: RoomUser;
}

const renderRoomUserConfigRow = (role: RoomAccessRole): renderRoomUserResponse => {
  const onDelete = vi.fn();
  const onUpdateRole = vi.fn();
  const user = createRandomUser();
  render(
    <ResponsiveContext.Provider value={'large'}>
      <RoomUsersConfigRow
        canUpdate={true}
        onDelete={onDelete}
        onUpdateRole={onUpdateRole}
        role={role}
        user={user}
      />
    </ResponsiveContext.Provider>,
    { wrapper: MagnifyTestingProvider },
  );
  return {
    onDelete,
    onUpdateRole,
    user,
  };
};

describe('MagnifyListRoomUsersConfigRow', () => {
  it('should render successfully', async () => {
    const { user } = renderRoomUserConfigRow(RoomAccessRole.OWNER);
    await screen.findByText(user.username);
    await screen.findByText(user.name);
    expect(screen.getByDisplayValue('Owner')).toBeInTheDocument();
    // Because Owner role
    expect(screen.queryByRole('button', { name: 'Open Menu' })).not.toBeInTheDocument();
  });

  it('select another role', async () => {
    const eventUser = userEvent.setup();
    const { onUpdateRole } = renderRoomUserConfigRow(RoomAccessRole.OWNER);
    const button = await screen.findByRole('button', { name: 'Open Drop; Selected: owner' });
    await act(() => {
      eventUser.click(button);
    });
    await waitFor(() => {
      screen.getByText('Owner');
      screen.getByText('Administrator');
      screen.getByText('Member');
      eventUser.click(screen.getByText('Administrator'));
    });

    await waitFor(async () => {
      expect(onUpdateRole).toHaveBeenNthCalledWith(1, 'administrator');
    });
  });

  it('delete role', async () => {
    const eventUser = userEvent.setup();
    const { onDelete } = renderRoomUserConfigRow(RoomAccessRole.ADMINISTRATOR);
    const button = await screen.findByRole('button', { name: 'Open Menu' });
    await act(async () => {
      eventUser.click(button);
    });

    await screen.findByText('Delete');

    await act(() => {
      eventUser.click(screen.getByText('Delete'));
    });

    await waitFor(async () => {
      expect(onDelete).toHaveBeenCalledTimes(1);
    });
  });
});
