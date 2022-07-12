import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';
import { ControllerProvider, MockController } from '../../../controller';
import createRandomMeetings from '../../../factories/meetings';
import MyMeetings from './MyMeetings';

describe('MyMeetings', () => {
  it('should render successfully a list of my meetings', async () => {
    const controller = new MockController();
    controller.getMyMeetings.mockResolvedValue(createRandomMeetings(5));

    render(
      <ControllerProvider controller={controller}>
        <QueryClientProvider client={new QueryClient()}>
          <IntlProvider locale="en">
            <MemoryRouter>
              <MyMeetings baseJitsiUrl="" />
            </MemoryRouter>
          </IntlProvider>
        </QueryClientProvider>
      </ControllerProvider>,
    );

    // 1) Load the meetings
    screen.getByText('(My meetings)');
    expect(screen.getAllByTitle('Loading...').length).toBe(3);

    // 2) Wait for the meetings to load
    await waitFor(() => screen.queryAllByTitle('Loading...').length === 0);
    await waitForElementToBeRemoved(() => screen.queryAllByTitle('Loading...'));

    // 3) Check the meetings
    expect(screen.getAllByText('Join').length).toBe(5);
  });
});
