import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import GroupsHeader from './GroupsHeader';
import { IntlProvider } from 'react-intl';

describe('GroupsHeader', () => {
  it("should switch everything on when some groups are selected and others don't", async () => {
    const mockedToggle = jest.fn();
    const user = userEvent.setup();

    render(
      <IntlProvider locale="en">
        <GroupsHeader
          groupsSelected={{ g1: false, g2: true, g3: false }}
          setGroupsSelected={mockedToggle}
        />
      </IntlProvider>,
    );

    await user.click(screen.getByTitle('Select all'));
    expect(mockedToggle).toHaveBeenCalledWith({ g1: true, g2: true, g3: true });
  });

  it('should switch everything off when all groups are selected', async () => {
    const mockedToggle = jest.fn();
    const user = userEvent.setup();

    render(
      <IntlProvider locale="en">
        <GroupsHeader
          groupsSelected={{ g1: true, g2: true, g3: true }}
          setGroupsSelected={mockedToggle}
        />
      </IntlProvider>,
    );

    await user.click(screen.getByTitle('Select all'));
    expect(mockedToggle).toHaveBeenCalledWith({ g1: false, g2: false, g3: false });
  });

  it('should switch everything on if check when all groups are unselected', async () => {
    const mockedToggle = jest.fn();
    const user = userEvent.setup();

    render(
      <IntlProvider locale="en">
        <GroupsHeader
          groupsSelected={{ g1: false, g2: false, g3: false }}
          setGroupsSelected={mockedToggle}
        />
      </IntlProvider>,
    );

    await user.click(screen.getByTitle('Select all'));
    expect(mockedToggle).toHaveBeenCalledWith({ g1: true, g2: true, g3: true });
  });
});
