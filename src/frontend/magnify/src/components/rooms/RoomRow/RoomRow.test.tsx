import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ControllerProvider, MockController } from '../../../controller';
import createRandomRoom from '../../../factories/room';
import DebugRoute from '../../../utils/DebugRoute';
import RoomRow from './RoomRow';

describe('RoomRow', () => {
  it('should render the row indicating that user is admin', async () => {
    const room = createRandomRoom(true);
    const user = userEvent.setup();

    const controller = new MockController();
    controller.joinRoom.mockResolvedValue({ token: 'token' });
    const queryClient = new QueryClient();

    render(
      <IntlProvider locale="en">
        <ControllerProvider controller={controller}>
          <QueryClientProvider client={queryClient}>
            <MemoryRouter>
              <Routes>
                <Route element={<RoomRow baseJitsiUrl="/" room={room} />} path="/" />
                <Route element={<DebugRoute />} path="*" />
              </Routes>
            </MemoryRouter>
          </QueryClientProvider>
        </ControllerProvider>
      </IntlProvider>,
    );

    screen.getByText(room.name);

    await user.click(screen.getByText('Join'));
  });
});
