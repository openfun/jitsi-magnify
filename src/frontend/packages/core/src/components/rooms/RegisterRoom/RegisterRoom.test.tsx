import { act, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { createRandomRoom } from '../../../factories';
import { renderWrappedInTestingProvider } from '../../../utils';
import { RegisterRoom } from './RegisterRoom';

describe('RegisterRoom', () => {
  it('should render successfully', async () => {
    const roomToCreate = createRandomRoom();
    const user = userEvent.setup();

    renderWrappedInTestingProvider(<RegisterRoom />);

    // 1) Open the form
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'add Room' }));
    });
    screen.getByRole('dialog');

    // 2) Fill in the form
    screen.getByRole('button', { name: 'Register room' });
    await act(async () => {
      await user.type(screen.getByRole('textbox', { name: 'Name' }), roomToCreate.name);
      await user.click(screen.getByRole('button', { name: `Register room` }));
    });

    // 4) Verify the dialog is closed
    await waitForElementToBeRemoved(() => screen.getByRole('dialog'));
  });
});
