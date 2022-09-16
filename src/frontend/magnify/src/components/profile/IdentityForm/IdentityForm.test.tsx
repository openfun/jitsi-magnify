import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ControllerProvider, MockController } from '../../../controller';
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

    const nameInput = screen.getByRole('textbox', { name: 'Name *' });
    const usernameInput = screen.getByRole('textbox', { name: 'Username *' });
    const emailInput = screen.getByRole('textbox', { name: 'Email *' });

    // Save button is initially disabled (no modification)
    const saveButton = screen.getByText('Save');
    expect(saveButton).toBeDisabled();

    // Name field and validators
    await user.clear(nameInput);
    await screen.findByText('This field is required');
    await user.type(nameInput, 'John Watson');

    // Username field and validators
    const invalidErrMessage =
      'Username is invalid, it should have between 3 and 16 letters, numbers or underscores';
    await user.clear(usernameInput);
    await screen.findByText('This field is required');
    await user.type(usernameInput, '@test');
    await user.clear(usernameInput);
    await user.type(usernameInput, '2t');
    await screen.findByText(invalidErrMessage);
    await user.clear(usernameInput);
    await user.type(usernameInput, 'atoolongusername7azertyui');
    await screen.findByText(invalidErrMessage);
    await user.clear(usernameInput);
    await user.type(usernameInput, 'JoshWatson3');

    // Email field and validators
    await user.clear(emailInput);
    await screen.findByText('This field is required');
    await user.type(emailInput, 'watson@test');
    await screen.findByText('Email is invalid');
    await user.type(emailInput, '.fr');
    expect(screen.queryByText('Email is invalid')).not.toBeInTheDocument();

    // Submit the form
    expect(saveButton).toBeEnabled();
    await user.click(saveButton);
    expect(controller.updateUser).toHaveBeenCalledWith({
      id: '123',
      name: 'John Watson',
      username: 'JoshWatson3',
      email: 'watson@test.fr',
    });
  }, 10000);
});
