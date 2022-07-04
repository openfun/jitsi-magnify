import { render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ControllerProvider, MockController } from '../../../controller';
import PasswordUpdateBlock from './PasswordUpdateBlock';

describe('PasswordUpdateBlock', () => {
  it('should render the form and an explanation', () => {
    render(
      <ControllerProvider controller={new MockController()}>
        <QueryClientProvider client={new QueryClient()}>
          <IntlProvider locale="en">
            <PasswordUpdateBlock />
          </IntlProvider>
        </QueryClientProvider>
      </ControllerProvider>,
    );

    // Verify we get the form
    screen.getByLabelText('Previous password*') as HTMLInputElement;
    screen.getByLabelText('New password*') as HTMLInputElement;
    screen.getByLabelText('Confirm new password*') as HTMLInputElement;

    // Verify we get the explanation
    screen.getByText('Update password');
    screen.getByText(/choose a password with more than 8 characters/);
    screen.getByText(/mix of letters, numbers and symbols/);
  });
});
