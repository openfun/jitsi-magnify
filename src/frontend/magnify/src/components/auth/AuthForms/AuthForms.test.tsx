import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ControllerProvider, MockController } from '../../../controller';
import AuthForms from './AuthForms';

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
