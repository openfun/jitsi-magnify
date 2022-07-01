import { render, screen } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import AuthForms from './AuthForms';
import { ControllerProvider, MockController } from '../../../controller';
import { IntlProvider } from 'react-intl';
import { QueryClient, QueryClientProvider } from 'react-query';

describe('AuthForms', () => {
  it('renders the login form by default', async () => {
    const user = userEvent.setup();

    render(
      <ControllerProvider controller={new MockController()}>
        <QueryClientProvider client={new QueryClient()}>
          <IntlProvider locale="en">
            <AuthForms />
          </IntlProvider>
        </QueryClientProvider>
      </ControllerProvider>,
    );

    screen.getByText('Create an account');
    const loginLink = screen.getByRole('link', { name: 'Login instead' });
    await user.click(loginLink);

    await screen.findByText('Login to my account');
  });
});
