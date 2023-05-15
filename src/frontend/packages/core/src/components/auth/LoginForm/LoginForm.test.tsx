import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { renderWrappedInTestingProvider } from '../../../utils/test-utils';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('should be possible to login successfully', async () => {
    const user = userEvent.setup();
    renderWrappedInTestingProvider(<LoginForm />);
    await act(async () => {
      await user.type(screen.getByRole('textbox', { name: 'Username' }), 'username');
      await user.type(screen.getByLabelText('Password'), 'password');
      await user.click(screen.getByRole('button', { name: 'Login' }));
    });
  });
});
