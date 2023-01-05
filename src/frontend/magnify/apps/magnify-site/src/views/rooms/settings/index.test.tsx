import { buildApiUrl } from '@openfun/magnify-components';
import { render, screen } from '@testing-library/react';
import { rest } from 'msw';
import React from 'react';
import { createMemoryRouter } from 'react-router-dom';
import { describe, it } from 'vitest';
import { TestingContainer } from '../../../components/TestingContainer';
import { defaultRoom } from '../../../mocks/handlers/rooms/roomsHandlers';
import { server } from '../../../mocks/server';
import { RoomSettingsView } from './index';

describe('RoomSettingsView', () => {
  it('Test', async () => {
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

    render(<TestingContainer router={router} />);
    await screen.findByText('Room settings');
  });
});
