import { waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { MockController } from '../../../controller';
import createRandomRoom from '../../../factories/room';
import { render, screen } from '../../../utils/test-utils';
import RegisterRoom from './RegisterRoom';

describe('RegisterRoom', () => {
  it('should render successfully', async () => {
    const controller = new MockController();
    const roomToCreate = createRandomRoom();
    controller.registerRoom.mockResolvedValue(roomToCreate);
    const user = userEvent.setup();

    render(<RegisterRoom />);

    // 1) Open the form
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Add Room' }));
    screen.getByRole('dialog');

    // 2) Fill in the form
    screen.getByRole('button', { name: 'Register room' });
    await user.type(screen.getByRole('textbox', { name: 'Name' }), roomToCreate.name);
    await user.click(screen.getByRole('button', { name: `Register room` }));

    // 4) Verify the dialog is closed
    await waitForElementToBeRemoved(() => screen.getByRole('dialog'));
  });
});
