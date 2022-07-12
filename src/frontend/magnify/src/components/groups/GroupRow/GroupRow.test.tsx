import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import GroupRow from './GroupRow';
import { ResponsiveContext } from 'grommet';
import createRandomGroup from '../../../factories/group';
import { MemoryRouter } from 'react-router-dom';

describe('GroupRow', () => {
  it.each([
    { numberOfMembers: 0, width: 'small', expectedNumberOfMembersRendered: 0, allDisplayed: true },
    { numberOfMembers: 9, width: 'small', expectedNumberOfMembersRendered: 2, allDisplayed: false },
    {
      numberOfMembers: 9,
      width: 'medium',
      expectedNumberOfMembersRendered: 4,
      allDisplayed: false,
    },
    { numberOfMembers: 9, width: 'large', expectedNumberOfMembersRendered: 9, allDisplayed: true },
    { numberOfMembers: 3, width: 'medium', expectedNumberOfMembersRendered: 3, allDisplayed: true },
  ])(
    'renders the row with $numberOfMembers images when screen is $width px wide and groups has $numberOfMembers members',
    ({ numberOfMembers, width, expectedNumberOfMembersRendered, allDisplayed }) => {
      const group = createRandomGroup(numberOfMembers);

      render(
        <ResponsiveContext.Provider value={width}>
          <MemoryRouter>
            <GroupRow group={group} selected={false} onToggle={() => {}} />
          </MemoryRouter>
        </ResponsiveContext.Provider>,
      );

      // Check if the number of images rendered is correct
      const avatars = screen.queryAllByTestId('avatar');
      expect(avatars.length).toBe(expectedNumberOfMembersRendered);

      // Check if images have the right title
      group.members.slice(0, expectedNumberOfMembersRendered).forEach((member) => {
        screen.getByTitle(member.name);
      });

      // The title of the group and the number of participants should be displayed
      screen.getByText(group.name);
      screen.getByText(numberOfMembers.toString());

      // If all images are not displayed, we should have an indicator with remaining names
      if (allDisplayed) {
        expect(screen.queryByTestId('more-members')).not.toBeInTheDocument();
      } else {
        const expectedTitle = group.members
          .slice(expectedNumberOfMembersRendered)
          .map((member) => member.name)
          .join(', ');
        screen.getByTitle(expectedTitle);
      }
    },
  );

  it.each([
    [true, false],
    [false, true],
  ])(
    'should call onToggle with %p if checkbox.checked is %p',
    async (initialChecked, expectedChecked) => {
      const mockedToggle = jest.fn();
      const user = userEvent.setup();

      render(
        <MemoryRouter>
          <GroupRow
            group={createRandomGroup(9)}
            selected={initialChecked}
            onToggle={mockedToggle}
          />
        </MemoryRouter>,
      );

      await user.click(screen.getByTitle('Select Group'));
      expect(mockedToggle).toHaveBeenCalledWith(expectedChecked);
    },
  );
});
