import React from 'react';
import { IntlProvider } from 'react-intl';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateMeetingForm from './CreateMeetingForm';
import { ControllerProvider, MockController } from '../../../controller';
import { QueryClient, QueryClientProvider } from 'react-query';

describe('CreateMeetingForm', () => {
  it('should render a form to create a meeting', async () => {
    const user = userEvent.setup();
    const controller = new MockController();

    jest
      .spyOn(global.Date, 'now')
      .mockImplementationOnce(() => new Date(2022, 4, 24, 0, 0, 0).valueOf());

    render(
      <ControllerProvider controller={controller}>
        <QueryClientProvider client={new QueryClient()}>
          <IntlProvider locale="en">
            <CreateMeetingForm roomSlug="room-slug" />
          </IntlProvider>
        </QueryClientProvider>
      </ControllerProvider>,
    );

    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Test meeting');
    await user.click(screen.getByRole('button', { name: 'Open Drop' }));
    await user.click(screen.getByText('12'));
    await user.click(screen.getByText('21'));
    await user.click(screen.getByText('Dates'));
    await user.type(screen.getByLabelText('Start Time'), '19:00');
    await user.clear(screen.getByLabelText('Duration'));
    await user.type(screen.getByLabelText('Duration'), '30');
    await user.click(screen.getByRole('button', { name: 'Tuesday' }));
    await user.click(screen.getByRole('button', { name: 'Thursday' }));
    await user.click(screen.getByRole('button', { name: 'Create meeting' }));

    await waitFor(() => {
      expect(controller.createMeeting).toHaveBeenCalledWith({
        roomSlug: 'room-slug',
        name: 'Test meeting',
        startDate: '2022-05-12T00:00:00.000Z',
        endDate: '2022-05-21T00:00:00.000Z',
        heldOnMonday: false,
        heldOnTuesday: true,
        heldOnWednesday: false,
        heldOnThursday: true,
        heldOnFriday: false,
        heldOnSaturday: false,
        heldOnSunday: false,
        startTime: '19:00',
        expectedDuration: 30,
      });
    });
  });
});
