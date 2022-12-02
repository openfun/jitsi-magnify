import userEvent from '@testing-library/user-event';
import React from 'react';
import { render, screen } from '../../../utils/test-utils';
import { AuthForms } from './AuthForms';

describe('AuthForms', () => {
  it('renders the login form by default', async () => {
    const user = userEvent.setup();

    render(
      <AuthForms footerLabel={'Footer text'} footerRouteLabel={'Footer Route Label'}>
        <div>Create an account</div>
      </AuthForms>,
    );

    screen.getByText('Create an account');
    screen.getByText('Footer text');
    screen.getByText('Footer Route Label');
  });
});
