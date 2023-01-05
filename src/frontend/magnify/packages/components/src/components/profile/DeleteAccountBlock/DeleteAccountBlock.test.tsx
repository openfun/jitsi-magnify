import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { DeleteAccountBlock } from './DeleteAccountBlock';

describe('DeleteAccountBlock', () => {
  it('should render the form and an explanation', async () => {
    const user = userEvent.setup();

    render(
      <QueryClientProvider client={new QueryClient()}>
        <IntlProvider locale="en">
          <DeleteAccountBlock />
        </IntlProvider>
      </QueryClientProvider>,
    );

    // Verify we get the explanation with appropriate warnings
    const warning = screen.getByText('Danger zone');
    expect(warning).toHaveStyle('color: rgb(255, 64, 64)');
    expect(warning).toHaveStyle('text-transform: uppercase');
    screen.getByText(/this action cannot be undone/);
    screen.getByText(/will delete all your data/);

    // Verify we have a dialog to confirm the deletion
    const button = screen.getByRole('button', { name: 'Delete account' });
    await act(async () => {
      user.click(button);
    });
    await screen.findByText('Confirm');

    // Verify we can confirm the deletion
    screen.getByRole('button', { name: 'Cancel' });
    const confirmButton = screen.getByRole('button', { name: 'Confirm delete account' });
    await act(async () => {
      user.click(confirmButton);
    });
  });
});
