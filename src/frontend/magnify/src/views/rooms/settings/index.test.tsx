import { render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import React from 'react';
import { createMemoryRouter } from 'react-router-dom';
import { MagnifyTestingProvider } from '../../../components';
import { roomConfigMessages } from '../../../components/rooms/RoomConfig/RoomConfig';
import { defaultRoom } from '../../../mocks/handlers/rooms/roomsHandlers';
import { server } from '../../../mocks/server';
import { buildApiUrl } from '../../../services/http/http.service';
import { RoomSettingsView } from './index';

describe('RoomSettingsView', () => {
  it('', async () => {
    server.use(
      rest.get(buildApiUrl('/rooms/123/'), (req, res, ctx) => {
        return res(ctx.json([defaultRoom]));
      }),
    );
    const router = createMemoryRouter(
      [
        {
          path: '/rooms/:id/settings',
          element: <RoomSettingsView />,
        },
      ],
      { initialEntries: ['/rooms/123/settings'], initialIndex: 1 },
    );
    render(<MagnifyTestingProvider router={router} />);
    const searchText = roomConfigMessages.enableScreenSharing.defaultMessage;
    const test = screen.queryByText(searchText);
    expect(test).toBe(null);
    await waitFor(() => {
      screen.getByText(searchText);
    });
  });
});
