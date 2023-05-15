import { render, screen } from '@testing-library/react';
import { rest } from 'msw';
import React from 'react';
import { createMemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { TestingContainer } from '../../../components/TestingContainer';
import { createRandomRoom } from '../../../factories';
import { server } from '../../../mocks/server';
import { buildApiUrl } from '../../../services';
import { RoomSettingsView } from './index';

describe('RoomSettingsView', () => {
  it('renders private room', async () => {
    server.use(
      rest.get(buildApiUrl('/rooms/:id/'), (req, res, ctx) => {
        const room = createRandomRoom();
        return res(ctx.json(room));
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

    await render(<TestingContainer router={router} />);
    await screen.findByText('Settings');
    screen.getByText('Room settings');
    screen.getByText('Members');
  });

  it('renders privfate room', async () => {
    server.use(
      rest.get(buildApiUrl('/rooms/:id/'), (req, res, ctx) => {
        const room = createRandomRoom();
        room.is_public = true;
        return res(ctx.json(room));
      }),
    );
    const router = createMemoryRouter(
      [
        {
          path: '/rooms/:id/settings',
          element: <RoomSettingsView />,
        },
      ],
      { initialEntries: ['/rooms/1234/settings'], initialIndex: 1 },
    );

    await render(<TestingContainer router={router} />);
    await screen.findByText('Settings');
    screen.getByText('Room settings');
    expect(screen.queryByText('Members')).toBe(null);
  });
});
