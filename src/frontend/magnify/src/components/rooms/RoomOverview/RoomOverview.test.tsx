import { render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';
import { ControllerProvider, MockController } from '../../../controller';
import createRandomRoom from '../../../factories/room';
import RoomOverview from './RoomOverview';

describe('RoomOverview', () => {
  it('should render successfully', async () => {
    const controller = new MockController();
    const room = createRandomRoom();
    controller.getRoomBySlug.mockResolvedValue(room);

    render(
      <IntlProvider locale="en">
        <ControllerProvider controller={controller}>
          <QueryClientProvider client={new QueryClient()}>
            <MemoryRouter>
              <RoomOverview baseJitsiUrl="/jitsi" roomSlug={room.name} />
            </MemoryRouter>
          </QueryClientProvider>
        </ControllerProvider>
      </IntlProvider>,
    );

    screen.getByRole('link', { name: 'Join room' });
    screen.getByRole('link', { name: 'Configure room' });
    expect(screen.getAllByTitle('Loading...')).toHaveLength(2 + 3 + 3);

    await screen.findByText(room.groups[0].name);
    screen.getByText('(7 meetings in this room)');
    screen.getByText('(4 groups in this room)');
    room.groups.forEach((group) => {
      screen.getByText(group.name);
    });
    room.meetings.forEach((meeting) => {
      screen.getByText(meeting.name);
    });
  });
});
