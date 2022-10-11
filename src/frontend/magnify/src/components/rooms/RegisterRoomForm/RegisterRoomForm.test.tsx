import { faker } from '@faker-js/faker';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import React from 'react';
import { buildApiUrl } from '../../../services/http/http.service';
import { Room } from '../../../types/entities/room';
import { render, screen } from '../../../utils/test-utils';
import RegisterRoomForm from './RegisterRoomForm';

describe('RegisterRoomForm', () => {
  const room: Room = {
    id: faker.datatype.uuid(),
    name: 'test',
    slug: faker.lorem.slug(),
    is_administrable: true,
  };
  const server = setupServer(
    rest.post(buildApiUrl('rooms/'), (req, res, ctx) => {
      return res(ctx.json({ data: room }));
    }),
  );

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
  it('should be possible to submit the form', async () => {
    const onSuccess = jest.fn();
    const user = userEvent.setup();
    render(<RegisterRoomForm onSuccess={onSuccess} />);

    // 1) Fill in the form
    screen.getByRole('button', { name: 'Register room' });
    await user.type(screen.getByRole('textbox', { name: 'Name' }), room.name ?? '');
    await user.click(screen.getByRole('button', { name: `Register room` }));

    // 3) Verify that the onSuccess callback is called
    expect(onSuccess).toHaveBeenCalled();
  });
});
