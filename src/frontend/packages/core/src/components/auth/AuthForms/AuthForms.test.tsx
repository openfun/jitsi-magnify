import { screen } from '@testing-library/react';
import React from 'react';
import { renderWrappedInTestingProvider } from '../../../utils/test-utils';
import { AuthForms } from './AuthForms';

describe('AuthForms', () => {
  it('renders the login form by default', async () => {
    renderWrappedInTestingProvider(
      <AuthForms footerLabel="Footer text" footerRouteLabel="Footer Route Label">
        <div>Create an account</div>
      </AuthForms>,
    );

    screen.getByText('Create an account');
    screen.getByText('Footer text');
    screen.getByText('Footer Route Label');
  });
});
