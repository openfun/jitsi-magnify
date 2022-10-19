import { faker } from '@faker-js/faker';
import { buildApiUrl, Room } from '@jitsi-magnify/core';

import { render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import React from 'react';
import { TestingContainer } from '../../../components/TestingContainer';
import { RoomsListView } from './index';

describe('RoomsListView', () => {
  const room: Room = {
    id: faker.datatype.uuid(),
    name: 'test-room',
    slug: faker.lorem.slug(),
    is_administrable: true,
  };
  const server = setupServer(
    rest.get(buildApiUrl('rooms/'), (req, res, ctx) => {
      return res(ctx.json([room]));
    }),
  );

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('Render list view with ', async () => {
    render(
      <TestingContainer>
        <RoomsListView />
      </TestingContainer>,
    );
    await waitFor(() => {
      screen.getByText('test-room');
    });
  });
});
