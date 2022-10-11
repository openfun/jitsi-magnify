import userEvent from '@testing-library/user-event';
import React from 'react';
import createRandomGroup from '../../../factories/group';
import { render, screen, waitForElementToBeRemoved } from '../../../utils/test-utils';
import GroupsList from './GroupsList';

// Mocks
const mockedGroups = [
  createRandomGroup(3, 7),
  createRandomGroup(9),
  createRandomGroup(23),
  createRandomGroup(1),
];

const renderGroupList = () => {
  render(<GroupsList groups={mockedGroups} />);
};

describe('GroupsList', () => {
  it('should be selectable group by group and globally', async () => {
    const user = userEvent.setup();
    renderGroupList();

    // Initial state: all checkboxes are unchecked; the number of groups is displayed
    const checkboxes = screen.queryAllByTitle('Select Group');
    checkboxes.forEach((checkbox) => expect(checkbox).not.toBeChecked());
    screen.getByText('4 groups');

    // Select one group
    await user.click(checkboxes[1]);
    expect(checkboxes[1]).toBeChecked();

    // Select all
    await user.click(screen.getByTitle('Select all'));
    checkboxes.forEach((checkbox) => expect(checkbox).toBeChecked());

    // Unselect all
    await user.click(screen.getByTitle('Select all'));
    checkboxes.forEach((checkbox) => expect(checkbox).not.toBeChecked());
  });

  it('should allow and pluralize buttons according to the number of groups selected', async () => {
    const user = userEvent.setup();
    renderGroupList();

    // Initial state: all checkboxes are unchecked; the number of groups is displayed
    const checkboxes = screen.queryAllByTitle('Select Group');
    const actionMenu = screen.getByRole('menu', { name: 'Actions' });

    // No group selected: All actions are singular and disabled
    await user.click(actionMenu);
    expect(screen.getByText('Delete group').parentElement).toBeDisabled();
    expect(screen.getByText('Rename group').parentElement).toBeDisabled();
    expect(screen.getByText('Create room for group').parentElement).toBeDisabled();
    expect(screen.getByText('Create meeting for group').parentElement).toBeDisabled();

    // 1 group selected: All actions are singular and enabled
    await user.click(checkboxes[1]);
    await user.click(actionMenu);
    expect(screen.getByText('Delete group').parentElement).not.toBeDisabled();
    expect(screen.getByText('Rename group').parentElement).not.toBeDisabled();
    expect(screen.getByText('Create room for group').parentElement).not.toBeDisabled();
    expect(screen.getByText('Create meeting for group').parentElement).not.toBeDisabled();

    // 2 groups selected: All actions are plural and enabled
    await user.click(checkboxes[2]);
    await user.click(actionMenu);
    expect(screen.getByText('Delete groups').parentElement).not.toBeDisabled();
    expect(screen.getByText('Rename group').parentElement).toBeDisabled();
    expect(screen.getByText('Create room for groups').parentElement).not.toBeDisabled();
    expect(screen.getByText('Create meeting for groups').parentElement).not.toBeDisabled();
  });

  it('should be possible to add a new group', async () => {
    const user = userEvent.setup();

    renderGroupList();

    await user.click(screen.getByRole('button', { name: 'Add group' }));
    await screen.findByRole('textbox', { name: 'Name' });
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    await waitForElementToBeRemoved(() => screen.getByRole('textbox', { name: 'Name' }));
  });
});
