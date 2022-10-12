import userEvent from '@testing-library/user-event';
import React from 'react';
import { defaultRoom } from '../../../mocks/handlers/rooms/roomsHandlers';
import { render, screen } from '../../../utils/test-utils';
import RegisterRoomForm from './RegisterRoomForm';

describe('RegisterRoomForm', () => {
  it('should be possible to submit the form', async () => {
    const onSuccess = jest.fn();
    const user = userEvent.setup();
    render(<RegisterRoomForm onSuccess={onSuccess} />);

    // 1) Fill in the form
    screen.getByRole('button', { name: 'Register room' });
    await user.type(screen.getByRole('textbox', { name: 'Name' }), defaultRoom.name ?? '');
    await user.click(screen.getByRole('button', { name: `Register room` }));

    // 3) Verify that the onSuccess callback is called
    expect(onSuccess).toHaveBeenCalled();
  });
});
