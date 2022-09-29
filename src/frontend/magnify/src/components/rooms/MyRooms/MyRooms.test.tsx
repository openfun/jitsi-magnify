import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';
import { ControllerProvider, MockController } from '../../../controller';
import createRandomRoom from '../../../factories/room';
import createRandomRooms from '../../../factories/rooms';
import MyRooms from './MyRooms';

describe('MyRooms', () => {
  it('should render successfully', async () => {
    const controller = new MockController();
    controller.getMyRooms.mockResolvedValue(createRandomRooms(7, 3));
    const roomToCreate = createRandomRoom(true);
    controller.registerRoom.mockResolvedValue(roomToCreate);
    const user = userEvent.setup();

    render(
      <ControllerProvider controller={controller}>
        <QueryClientProvider client={new QueryClient()}>
          <IntlProvider locale="en">
            <MemoryRouter>
              <MyRooms baseJitsiUrl="" />
            </MemoryRouter>
          </IntlProvider>
        </QueryClientProvider>
      </ControllerProvider>,
    );

    // 1) Load the rooms
    expect(screen.getAllByTitle('Loading...').length).toBe(3);

    // 2) Wait for the rooms to load
    await waitFor(() => screen.queryAllByTitle('Loading...').length === 0);
    await waitForElementToBeRemoved(() => screen.queryAllByTitle('Loading...'));

    // 3) Check the rooms
    expect(screen.getAllByRole('button', { name: 'Join' }).length).toBe(7);
  });
});
