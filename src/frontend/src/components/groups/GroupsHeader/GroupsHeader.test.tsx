import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import GroupsHeader from './GroupsHeader';

describe('GroupsHeader', () => {
  it("should switch everything on when some groups are selected and others don't", () => {
    const mockedToogle = jest.fn();

    render(
      <GroupsHeader
        groupsSelected={{ g1: false, g2: true, g3: false }}
        setGroupsSelected={mockedToogle}
      />,
    );

    fireEvent.click(screen.getByTitle('Select All Group'));
    expect(mockedToogle).toHaveBeenCalledWith({ g1: true, g2: true, g3: true });
  });

  it('should switch everything off when all groups are selected', () => {
    const mockedToogle = jest.fn();

    render(
      <GroupsHeader
        groupsSelected={{ g1: true, g2: true, g3: true }}
        setGroupsSelected={mockedToogle}
      />,
    );

    fireEvent.click(screen.getByTitle('Select All Group'));
    expect(mockedToogle).toHaveBeenCalledWith({ g1: false, g2: false, g3: false });
  });

  it('should switch everything on if check when all groups are unselected', () => {
    const mockedToogle = jest.fn();

    render(
      <GroupsHeader
        groupsSelected={{ g1: false, g2: false, g3: false }}
        setGroupsSelected={mockedToogle}
      />,
    );

    fireEvent.click(screen.getByTitle('Select All Group'));
    expect(mockedToogle).toHaveBeenCalledWith({ g1: true, g2: true, g3: true });
  });
});
