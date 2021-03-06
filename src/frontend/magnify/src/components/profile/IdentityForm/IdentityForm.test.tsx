import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl';
import IdentityForm from './IdentityForm';
import { ControllerProvider, MockController } from '../../../controller';
import { QueryClient, QueryClientProvider } from 'react-query';

describe('IdentityForm', () => {
  it('should render a form that can be filled and submited', async () => {
    const user = userEvent.setup();
    const controller = new MockController();

    render(
      <ControllerProvider controller={controller}>
        <QueryClientProvider client={new QueryClient()}>
          <IntlProvider locale="en">
            <IdentityForm id="123" name="John Doe" username="johndoe3" email="john.doe@test.fr" />
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
