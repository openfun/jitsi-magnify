import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl';
import PasswordUpdateForm from './PasswordUpdateForm';
import { ControllerProvider, MockController } from '../../../controller';
import { QueryClient, QueryClientProvider } from 'react-query';
import { validationMessages } from '../../../i18n/Messages';

describe('PasswordUpdateForm', () => {
  it('should render a form that can be filled and submited', async () => {
    const user = userEvent.setup();
    const controller = new MockController();

    render(
      <ControllerProvider controller={controller}>
        <QueryClientProvider client={new QueryClient()}>
          <IntlProvider locale="en">
            <PasswordUpdateForm />
          </IntlProvider>
        </QueryClientProvider>
      </ControllerProvider>,
    );

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
    await user.type(previousPasswordInput, 'oldPassword');
    expect(saveButton).toBeDisabled();

    await user.type(newPasswordInput, 'newPassword');
    expect(saveButton).toBeDisabled();

    await user.type(confirmPasswordInput, 'new');
    fireEvent.blur(confirmPasswordInput);
    await screen.findByText(validationMessages.confirmDoesNotMatch.defaultMessage);
    expect(saveButton).toBeDisabled();
    await user.type(confirmPasswordInput, 'newPassword');
  });
});
