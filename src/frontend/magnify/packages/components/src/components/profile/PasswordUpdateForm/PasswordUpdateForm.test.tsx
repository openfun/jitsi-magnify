import { act, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { validationMessages } from '../../../i18n/Messages';
import { renderWrappedInTestingProvider } from '../../../utils/test-utils';
import { PasswordUpdateForm } from './PasswordUpdateForm';

describe('PasswordUpdateForm', () => {
  it('should render a form that can be filled and submited', async () => {
    const user = userEvent.setup();
    renderWrappedInTestingProvider(<PasswordUpdateForm />);

    const previousPasswordInput = screen.getByLabelText('Previous password') as HTMLInputElement;
    const newPasswordInput = screen.getByLabelText('New password') as HTMLInputElement;
    const confirmPasswordInput = screen.getByLabelText('Confirm new password') as HTMLInputElement;

    // initially the form is empty
    expect(previousPasswordInput.value).toBe('');
    expect(newPasswordInput.value).toBe('');
    expect(confirmPasswordInput.value).toBe('');

    // Save button is initially disabled (no modification)
    const saveButton = screen.getByText('Save new password');
    expect(saveButton).toBeDisabled();

    // Type previous password
    await act(async () => {
      await user.type(previousPasswordInput, 'oldPassword');
    });
    expect(saveButton).toBeDisabled();

    await act(async () => {
      await user.type(newPasswordInput, 'newPassword');
    });
    expect(saveButton).toBeDisabled();

    await act(async () => {
      await user.type(confirmPasswordInput, 'new');
    });
    fireEvent.blur(confirmPasswordInput);
    await screen.findByText(validationMessages.confirmDoesNotMatch.defaultMessage);
    expect(saveButton).toBeDisabled();
    await act(async () => {
      await user.type(confirmPasswordInput, 'newPassword');
    });
  });
});
