import { faker } from '@faker-js/faker';
import { render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import React from 'react';
import { createMemoryRouter } from 'react-router-dom';
import { MagnifyTestingProvider } from '../../../components';
import { roomConfigMessages } from '../../../components/rooms/RoomConfig/RoomConfig';
import { buildApiUrl } from '../../../services/http/http.service';
import { Room } from '../../../types/entities/room';
import { RoomSettingsView } from './index';

describe('RoomSettingsView', () => {
  const room: Room = {
    id: faker.datatype.uuid(),
    name: 'test-room',
    slug: faker.lorem.slug(),
    is_administrable: true,
  };
  const server = setupServer(
    rest.get(buildApiUrl('rooms/123/'), (req, res, ctx) => {
      return res(ctx.json([room]));
    }),
  );

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
  it('', async () => {
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
