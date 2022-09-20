import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { createRandomGroupMember } from '../../../factories/member';
import UserRow from './UserRow';

describe('UserRow', () => {
  it('should render a non admn user', () => {
    const user = createRandomGroupMember();

    render(
      <IntlProvider locale="en">
        <UserRow user={user} />
      </IntlProvider>,
    );

    screen.getByText(user.name);
    expect(screen.getByTitle(user.name)).toHaveStyle(`background-image: url('${user.avatar}')`);
    expect(screen.queryByText('Admin')).not.toBeInTheDocument();
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('should render an admin user', () => {
    const user = createRandomGroupMember();

    render(
      <IntlProvider locale="en">
        <UserRow isAdmin user={user} />
      </IntlProvider>,
    );

    screen.getByText(user.name);
    expect(screen.getByTitle(user.name)).toHaveStyle(`background-image: url('${user.avatar}')`);
    screen.getByText('Admin');
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('should render a selectable user', async () => {
    const displayedUser = createRandomGroupMember();
    const user = userEvent.setup();
    const onToggle = jest.fn();

    render(
      <IntlProvider locale="en">
        <UserRow onToggle={onToggle} user={displayedUser} />
      </IntlProvider>,
    );

    screen.getByText(displayedUser.name);
    expect(screen.getByTitle(displayedUser.name)).toHaveStyle(
      `background-image: url('${displayedUser.avatar}')`,
    );

    await user.click(screen.getByRole('checkbox'));
    expect(onToggle).toHaveBeenCalled();
  });
});
