import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { ControllerProvider, MockController } from '../../../controller';
import createRandomGroups from '../../../factories/groups';
import createRandomRoom from '../../../factories/room';
import AddGroupToRoomDialog from './AddGroupToRoomDialog';

describe('AddGroupToRoomDialog', () => {
  it('should render successfully', async () => {
    window.HTMLElement.prototype.scrollIntoView = function () {}; // see issue jsdom #1695
    const controller = new MockController();
    const groups = createRandomGroups(7);
    const resolvedRoom = createRandomRoom();
    controller.getGroups.mockResolvedValue(groups);
    controller.addGroupsToRoom.mockResolvedValue({
      ...resolvedRoom,
      groups: [...resolvedRoom.groups, groups[1], groups[3]],
    });
    const user = userEvent.setup();
    const onClose = jest.fn();

    render(
      <IntlProvider locale="en">
        <ControllerProvider controller={controller}>
          <QueryClientProvider client={new QueryClient()}>
            <AddGroupToRoomDialog onClose={onClose} open={true} roomSlug="room-slug" />
          </QueryClientProvider>
        </ControllerProvider>
      </IntlProvider>,
    );

    // Initial: no group selected, await the end of loading
    const select = await screen.findByText('Select groups to add');
    expect(screen.getByRole('button', { name: 'Add 0 group' })).toBeDisabled();

    // Add 3 groups
    await user.click(select);
    await user.click(screen.getByText(groups[1].name));
    await user.click(screen.getByText(groups[3].name));
    await user.click(screen.getByText(groups[5].name));
    await user.click(screen.getByText('Add groups to room'));
    expect(screen.getByRole('button', { name: 'Add 3 groups' })).toBeEnabled();

    // Remove a group
    await user.click(
      screen.getByRole('link', {
        name: `${groups[5].name} (${groups[5].members.length}) FormClose`,
      }),
    );
    screen.getByText('Add 2 groups');

    // Submit
    const submitButton = screen.getByRole('button', { name: 'Add 2 groups' });
    expect(submitButton).toBeEnabled();
    await user.click(submitButton);
    await waitFor(() => {
      expect(controller.addGroupsToRoom).toHaveBeenCalledWith({
        roomSlug: 'room-slug',
        groupIds: [groups[1].id, groups[3].id],
      });
      expect(onClose).toHaveBeenCalled();
    });
  });
});
