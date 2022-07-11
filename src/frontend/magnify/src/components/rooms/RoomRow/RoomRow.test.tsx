import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RoomRow from './RoomRow';
import createRandomRoom from '../../../factories/room';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import DebugRoute from '../../../utils/DebugRoute';
import { IntlProvider } from 'react-intl';
import { ControllerProvider, MockController } from '../../../controller';
import { QueryClient, QueryClientProvider } from 'react-query';

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
                <Route path="/" element={<RoomRow room={room} baseJitsiUrl="/" />} />
                <Route path="*" element={<DebugRoute />} />
              </Routes>
            </MemoryRouter>
          </QueryClientProvider>
        </ControllerProvider>
      </IntlProvider>,
    );

    screen.getByText(room.name);
    screen.getByText('Admin');

    await user.click(screen.getByText('Join'));

    expect(screen.getByText(`//${room.slug}`)).toBeInTheDocument();
  });
});
