import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ControllerProvider, MockController } from '../../../controller';
import { validationMessages } from '../../../i18n/Messages';
import IdentityForm from './IdentityForm';

describe('IdentityForm', () => {
  it('should render a form that can be filled and submited', async () => {
    const user = userEvent.setup();
    const controller = new MockController();

    render(
      <ControllerProvider controller={controller}>
        <QueryClientProvider client={new QueryClient()}>
          <IntlProvider locale="en">
            <IdentityForm email="john.doe@test.fr" id="123" name="John Doe" username="johndoe3" />
          </IntlProvider>
        </QueryClientProvider>
      </ControllerProvider>,
    );

    const nameInput = screen.getByRole('textbox', { name: 'Name' });
    const usernameInput = screen.getByRole('textbox', { name: 'Username' });
    const emailInput = screen.getByRole('textbox', { name: 'Email' });

    // Save button is initially disabled (no modification)
    const saveButton = screen.getByText('Save');
    expect(saveButton).toBeDisabled();

    // Name field and validators
    await user.clear(nameInput);
    fireEvent.blur(nameInput);

    await screen.findByText('name is a required field');
    await user.type(nameInput, 'John Watson');

    // Username field and validators
    await user.clear(usernameInput);
    fireEvent.blur(usernameInput);
    await screen.findByText('username is a required field');
    await user.type(usernameInput, '@test');
    await user.clear(usernameInput);
    await user.type(usernameInput, '2t');
    await screen.findByText(validationMessages.usernameInvalid.defaultMessage);
    await user.clear(usernameInput);
    await user.type(usernameInput, 'atoolongusername7azertyui');
    await screen.findByText(validationMessages.usernameInvalid.defaultMessage);
    await user.clear(usernameInput);
    await user.type(usernameInput, 'JoshWatson3');

    // Email field and validators
    await user.clear(emailInput);
    fireEvent.blur(emailInput);
    await screen.findByText('email is a required field');
    await user.type(emailInput, 'watson@test');
    await screen.findByText('email must be a valid email');
    await user.type(emailInput, '.fr');
    expect(screen.queryByText('email must be a valid email')).not.toBeInTheDocument();
  }, 10000);
});
