import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl';
import IdentityForm from './IdentityForm';

describe('IdentityForm', () => {
  it('should render a form that can be filled and submited', async () => {
    userEvent.setup();

    render(
      <IntlProvider locale="en">
        <IdentityForm name="John Doe" username="johndoe3" email="john.doe@test.fr" />
      </IntlProvider>,
    );

    const nameInput = screen.getByRole('textbox', { name: 'Name *' });
    const usernameInput = screen.getByRole('textbox', { name: 'Username *' });
    const emailInput = screen.getByRole('textbox', { name: 'Email *' });

    // Save button is initially disabled (no modification)
    const saveButton = screen.getByText('Save');
    expect(saveButton).toBeDisabled();

    // Name field and validators
    await userEvent.clear(nameInput);
    await screen.findByText('This field is required');
    await userEvent.type(nameInput, 'John Watson');

    // Username field and validators
    const invalidErrMessage =
      'Username is invalid, it should have between 3 and 16 letters, numbers or underscores';
    await userEvent.clear(usernameInput);
    await screen.findByText('This field is required');
    await userEvent.type(usernameInput, '@test');
    await userEvent.clear(usernameInput);
    await userEvent.type(usernameInput, '2t');
    await screen.findByText(invalidErrMessage);
    await userEvent.clear(usernameInput);
    await userEvent.type(usernameInput, 'atoolongusername7azertyui');
    await screen.findByText(invalidErrMessage);
    await userEvent.clear(usernameInput);
    await userEvent.type(usernameInput, 'JoshWatson3');

    // Email field and validators
    await userEvent.clear(emailInput);
    await screen.findByText('This field is required');
    await userEvent.type(emailInput, 'watson@test');
    await screen.findByText('Email is invalid');
    await userEvent.type(emailInput, '.fr');
    expect(screen.queryByText('Email is invalid')).not.toBeInTheDocument();

    // Submit the form
    expect(saveButton).toBeEnabled();
    await userEvent.click(saveButton);
  });
});
