import { act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { fireEvent, render, screen } from '../../../utils/test-utils';
import { IdentityForm } from './IdentityForm';

describe('IdentityForm', () => {
  it('should render a form that can be filled and submited', async () => {
    const user = userEvent.setup();

    render(<IdentityForm />);

    const nameInput = screen.getByRole('textbox', { name: 'Name' });
    const usernameInput = screen.getByRole('textbox', { name: 'Username' });
    const emailInput = screen.getByRole('textbox', { name: 'Email' });

    // Save button is initially disabled (no modification)
    const saveButton = screen.getByText('Save');
    expect(saveButton).toBeDisabled();

    // Name field and validators
    await act(async () => {
      await user.clear(nameInput);
    });
    fireEvent.blur(nameInput);

    await screen.findByText('This field is required');
    await act(async () => {
      await user.type(nameInput, 'John Watson');
    });

    /**
     * At the moment, the fields are disabled, so we can't
     * perform actions on them, but soon this won't be the case.
     */
    // // Username field and validators
    // await user.clear(usernameInput);
    // fireEvent.blur(usernameInput);
    // await screen.findByText('username is a required field');
    // await user.type(usernameInput, '@test');
    // await user.clear(usernameInput);
    // await user.type(usernameInput, '2t');
    // await screen.findByText(validationMessages.usernameInvalid.defaultMessage);
    // await user.clear(usernameInput);
    // await user.type(usernameInput, 'atoolongusername7azertyui');
    // await screen.findByText(validationMessages.usernameInvalid.defaultMessage);
    // await user.clear(usernameInput);
    // await user.type(usernameInput, 'JoshWatson3');
    //
    // // Email field and validators
    // await user.clear(emailInput);
    // fireEvent.blur(emailInput);
    // await screen.findByText('email is a required field');
    // await user.type(emailInput, 'watson@test');
    // await screen.findByText('email must be a valid email');
    // await user.type(emailInput, '.fr');
    // expect(screen.queryByText('email must be a valid email')).not.toBeInTheDocument();
  }, 10000);
});
