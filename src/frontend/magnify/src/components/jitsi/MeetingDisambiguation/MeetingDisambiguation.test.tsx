import React from 'react';
import { IntlProvider } from 'react-intl';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import MeetingDisambiguation from './MeetingDisambiguation';
import { createMeetingInProgress } from '../../../factories/meeting';
import createRandomRoom from '../../../factories/room';
import withToken from '../../../factories/withToken';

describe('MeetingDisambiguation', () => {
  it('should render only meetings if it is not possible to join the room itself', async () => {
    const possibilities = [
      { meeting: withToken(createMeetingInProgress(), 'test-token') },
      { meeting: withToken(createMeetingInProgress(), 'test-token') },
    ];
    const setCurrent = jest.fn();
    const user = userEvent.setup();

    render(
      <IntlProvider locale="en">
        <MeetingDisambiguation
          roomSlug="my-room"
          possibilities={possibilities}
          setCurrent={setCurrent}
        />
      </IntlProvider>,
    );

    expect(screen.queryByText('Join the room itself')).not.toBeInTheDocument();
    screen.getByText(possibilities[0].meeting?.name as string);
    screen.getByText(possibilities[1].meeting?.name as string);

    await user.click(screen.getAllByRole('button', { name: 'Join' })[1]);
    expect(setCurrent).toHaveBeenCalledWith(possibilities[1]);
  });

  it('should render the room and the meetings if there are both possibilities', async () => {
    const possibilities = [
      { meeting: withToken(createMeetingInProgress(), 'test-token') },
      { meeting: withToken(createMeetingInProgress(), 'test-token') },
      { room: withToken(createRandomRoom(), 'test-token') },
    ];
    const setCurrent = jest.fn();
    const user = userEvent.setup();

    render(
      <IntlProvider locale="en">
        <MeetingDisambiguation
          roomSlug="my-room"
          possibilities={possibilities}
          setCurrent={setCurrent}
        />
      </IntlProvider>,
    );

    screen.getByText('Join the room itself');
    screen.getByText(possibilities[0].meeting?.name as string);
    screen.getByText(possibilities[1].meeting?.name as string);

    await user.click(screen.getByRole('button', { name: 'Join the room itself' }));
    expect(setCurrent).toHaveBeenNthCalledWith(1, possibilities[2]);
  });
});
