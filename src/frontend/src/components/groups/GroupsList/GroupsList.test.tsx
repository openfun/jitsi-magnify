import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import GroupsList from './GroupsList';
import { mockedGroups } from './mocks';

describe('GroupsList', () => {
  it('should be selectable group by group and globally', () => {
    render(<GroupsList groups={mockedGroups} />);

    // Initial state: all checkboxes are unchecked; the number of groups is displayed
    const checkboxes = screen.queryAllByTitle('Select Group');
    checkboxes.forEach((checkbox) => expect(checkbox).not.toBeChecked());
    screen.getByText('(4 groups)');

    // Select one group
    fireEvent.click(checkboxes[1]);
    expect(checkboxes[1]).toBeChecked();

    // Select all
    fireEvent.click(screen.getByTitle('Select All Group'));
    checkboxes.forEach((checkbox) => expect(checkbox).toBeChecked());

    // Unselect all
    fireEvent.click(screen.getByTitle('Select All Group'));
    checkboxes.forEach((checkbox) => expect(checkbox).not.toBeChecked());
  });

  it('should allow and pluralize buttons according to the number of groups selected', () => {
    render(<GroupsList groups={mockedGroups} />);

    // Initial state: all checkboxes are unchecked; the number of groups is displayed
    const checkboxes = screen.queryAllByTitle('Select Group');
    const actionMenu = screen.getByRole('menu', { name: 'Actions' });

    // No group selected: All actions are singular and disabled
    fireEvent.click(actionMenu);
    expect(screen.getByText('Delete group').parentElement).toBeDisabled();
    expect(screen.getByText('Rename group').parentElement).toBeDisabled();
    expect(screen.getByText('Create room for group').parentElement).toBeDisabled();
    expect(screen.getByText('Create meeting for group').parentElement).toBeDisabled();

    // 1 group selected: All actions are singular and enabled
    fireEvent.click(checkboxes[1]);
    expect(screen.getByText('Delete group').parentElement).not.toBeDisabled();
    expect(screen.getByText('Rename group').parentElement).not.toBeDisabled();
    expect(screen.getByText('Create room for group').parentElement).not.toBeDisabled();
    expect(screen.getByText('Create meeting for group').parentElement).not.toBeDisabled();

    // 2 groups selected: All actions are plural and enabled
    fireEvent.click(checkboxes[2]);
    expect(screen.getByText('Delete groups').parentElement).not.toBeDisabled();
    expect(screen.getByText('Rename groups').parentElement).not.toBeDisabled();
    expect(screen.getByText('Create room for groups').parentElement).not.toBeDisabled();
    expect(screen.getByText('Create meeting for groups').parentElement).not.toBeDisabled();
  });
});
