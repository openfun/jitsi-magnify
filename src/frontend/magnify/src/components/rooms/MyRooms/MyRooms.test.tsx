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
    screen.getByText('(My rooms)');
    screen.getByText('Register new room');
    expect(screen.getAllByTitle('Loading rooms...').length).toBe(3);

    // 2) Wait for the rooms to load
    await waitFor(() => screen.queryAllByTitle('Loading rooms...').length === 0);
    await waitForElementToBeRemoved(() => screen.queryAllByTitle('Loading rooms...'));

    // 3) Check the rooms
    expect(screen.getAllByRole('button', { name: 'Join' }).length).toBe(7);

    // 4) Register a new room
    await user.click(screen.getByRole('button', { name: 'Register new room' }));
    await user.type(screen.getByRole('textbox', { name: 'Name' }), roomToCreate.name);
    await user.click(screen.getByRole('button', { name: `Register room ${roomToCreate.name}` }));
    await waitForElementToBeRemoved(() => screen.getByRole('dialog'));

    // 5) Check the new room
    expect(screen.getAllByRole('button', { name: 'Join' }).length).toBe(8);
    screen.getByText(roomToCreate.name);
  });
});
