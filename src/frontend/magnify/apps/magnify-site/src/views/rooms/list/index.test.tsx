import { faker } from '@faker-js/faker';
import { buildApiUrl, Room } from '@openfun/magnify-components';

import { render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import React from 'react';
import { TestingContainer } from '../../../components/TestingContainer';
import { server } from '../../../mocks/server';
import { RoomsListView } from './index';

describe('RoomsListView', () => {
  it('Render list view with ', async () => {
    const room: Room = {
      id: faker.datatype.uuid(),
      name: 'test-room',
      slug: faker.lorem.slug(),
      jitsi: {
        room: 'test-room',
        token: '123',
      },
      is_administrable: true,
    };
    server.use(
      rest.get(buildApiUrl('/rooms/'), (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ results: [room] }));
      }),
    );
    render(
      <TestingContainer>
        <RoomsListView />
      </TestingContainer>,
    );
    await waitFor(async () => {
      screen.getByText('test-room');
    });
  });
});
