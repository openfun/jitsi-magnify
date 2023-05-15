import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { vi } from 'vitest';
import { defaultRoom } from '../../../mocks/allHandlers/rooms/roomsHandlers';
import { renderWrappedInTestingProvider } from '../../../utils/test-utils';
import { RegisterRoomForm } from './RegisterRoomForm';

describe('RegisterRoomForm', () => {
  it('should be possible to submit the form', async () => {
    const onSuccess = vi.fn();
    const user = userEvent.setup();
    renderWrappedInTestingProvider(<RegisterRoomForm onSuccess={onSuccess} />);

    // 1) Fill in the form
    screen.getByRole('button', { name: 'Register room' });
    await act(async () => {
      await user.type(screen.getByRole('textbox', { name: 'Name' }), defaultRoom.name ?? '');
      await user.click(screen.getByRole('button', { name: `Register room` }));
    });

    // 3) Verify that the onSuccess callback is called
    expect(onSuccess).toHaveBeenCalled();
  });
});
