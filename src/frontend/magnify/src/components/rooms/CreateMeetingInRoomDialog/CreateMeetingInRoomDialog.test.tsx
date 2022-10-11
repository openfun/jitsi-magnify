import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { ControllerProvider, MockController } from '../../../controller';
import CreateMeetingInRoomDialog from './CreateMeetingInRoomDialog';

describe('CreateMeetingInRoomDialog', () => {
  it('should provide a cancel button', () => {
    const controller = new MockController();
    const onClose = jest.fn();

    render(
      <IntlProvider locale="en">
        <ControllerProvider controller={controller}>
          <QueryClientProvider client={new QueryClient()}>
            <CreateMeetingInRoomDialog onClose={onClose} open={true} roomSlug="room-slug" />
          </QueryClientProvider>
        </ControllerProvider>
      </IntlProvider>,
    );

    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('should provide a form', () => {
    const controller = new MockController();
    const onClose = jest.fn();

    render(
      <IntlProvider locale="en">
        <ControllerProvider controller={controller}>
          <QueryClientProvider client={new QueryClient()}>
            <CreateMeetingInRoomDialog onClose={onClose} open={true} roomSlug="room-slug" />
          </QueryClientProvider>
        </ControllerProvider>
      </IntlProvider>,
    );

    expect(document.querySelector('form')).toBeInTheDocument();
  });

  // Other behaviours have mostly be tested
  // in the CreateMeetingForm component.
});
