import React from 'react';
import { render, screen } from '../../../utils';
import { InstantRoom } from './index';

describe('InstantRoom', () => {
  it('', async () => {
    render(<InstantRoom />);
    screen.getByRole('button', { name: 'Start' });
    screen.getByRole('textbox', { name: 'roomName' });
  });
});
