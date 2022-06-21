import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl';
import PasswordUpdateForm from './PasswordUpdateForm';

describe('PasswordUpdateForm', () => {
  it('should render a form that can be filled and submited', async () => {
    userEvent.setup();

    render(
      <IntlProvider locale="en">
        <PasswordUpdateForm />
      </IntlProvider>,
    );

    const previousPasswordInput = screen.getByLabelText('Previous password*') as HTMLInputElement;
    const newPasswordInput = screen.getByLabelText('New password*') as HTMLInputElement;
    const confirmPasswordInput = screen.getByLabelText('Confirm new password*') as HTMLInputElement;

    // initially the form is empty
    expect(previousPasswordInput.value).toBe('');
    expect(newPasswordInput.value).toBe('');
    expect(confirmPasswordInput.value).toBe('');

    // Save button is initially disabled (no modification)
    const saveButton = screen.getByText('Save new password');
    expect(saveButton).toBeDisabled();

    // Type previous password
    await userEvent.type(previousPasswordInput, 'oldPassword');
    expect(saveButton).toBeDisabled();

    await userEvent.type(newPasswordInput, 'newPassword');
    expect(saveButton).toBeDisabled();

    await userEvent.type(confirmPasswordInput, 'new');
    await screen.findByText("New password and it's confirmation do not match");
    expect(saveButton).toBeDisabled();
    await userEvent.type(confirmPasswordInput, 'Password');

    // Submit the form
    expect(saveButton).toBeEnabled();
    await userEvent.click(saveButton);
  });
});
