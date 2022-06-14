import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Context as ReactiveContext } from 'react-responsive';
import GroupRow from './GroupRow';
import { mockedMembers } from './mocks';

describe('GroupRow', () => {
  it.each([
    { numberOfMembers: 0, width: 400, expectedNumberOfMembersRendered: 0, allDisplayed: true },
    { numberOfMembers: 9, width: 400, expectedNumberOfMembersRendered: 1, allDisplayed: false },
    { numberOfMembers: 9, width: 700, expectedNumberOfMembersRendered: 3, allDisplayed: false },
    { numberOfMembers: 9, width: 900, expectedNumberOfMembersRendered: 5, allDisplayed: false },
    { numberOfMembers: 9, width: 1300, expectedNumberOfMembersRendered: 7, allDisplayed: false },
    { numberOfMembers: 9, width: 1850, expectedNumberOfMembersRendered: 9, allDisplayed: true },
    { numberOfMembers: 3, width: 900, expectedNumberOfMembersRendered: 3, allDisplayed: true },
  ])(
    'renders the row with $numberOfMembers images when screen is $width px wide and groups has $numberOfMembers members',
    ({ numberOfMembers, width, expectedNumberOfMembersRendered, allDisplayed }) => {
      render(
        <ReactiveContext.Provider value={{ width }}>
          <GroupRow
            group={{
              id: '1',
              name: 'Group 1',
              members: mockedMembers.slice(0, numberOfMembers),
            }}
            selected={false}
            onToogle={() => {}}
          />
        </ReactiveContext.Provider>,
      );

      // Check if the number of images rendered is correct
      const avatars = screen.queryAllByTestId('group-row-member-image');
      expect(avatars.length).toBe(expectedNumberOfMembersRendered);

      // Check if images have the right title
      mockedMembers.slice(0, expectedNumberOfMembersRendered).forEach((member, index) => {
        screen.getByTitle(member.name);
      });

      // The title of the group and the number of participants should be displayed
      screen.getByText('Group 1');
      screen.getByText(numberOfMembers.toString());

      // If all images are not displayed, we should have an indicator with remaining names
      if (allDisplayed) {
        expect(screen.queryByTestId('more-members')).toBeNull();
      } else {
        const expectedTitle = mockedMembers
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
    'should call onToogle with %p if checkbox.checked is %p',
    (initialChecked, expectedChecked) => {
      const mockedToogle = jest.fn();

      render(
        <GroupRow
          group={{ id: '1', name: 'Group 1', members: mockedMembers }}
          selected={initialChecked}
          onToogle={mockedToogle}
        />,
      );

      fireEvent.click(screen.getByTitle('Select Group'));
      expect(mockedToogle).toHaveBeenCalledWith(expectedChecked);
    },
  );
});
