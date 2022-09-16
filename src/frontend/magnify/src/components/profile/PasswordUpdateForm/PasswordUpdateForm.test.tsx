import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ControllerProvider, MockController } from '../../../controller';
import { createRandomProfile } from '../../../factories/profile';
import PasswordUpdateForm from './PasswordUpdateForm';

describe('PasswordUpdateForm', () => {
  it('should render a form that can be filled and submited', async () => {
    const user = userEvent.setup();
    const controller = new MockController();
    const fakeUser = createRandomProfile();

    render(
      <ControllerProvider controller={controller}>
        <QueryClientProvider client={new QueryClient()}>
          <IntlProvider locale="en">
            <PasswordUpdateForm />
          </IntlProvider>
        </QueryClientProvider>
      </ControllerProvider>,
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
    await user.type(previousPasswordInput, 'oldPassword');
    expect(saveButton).toBeDisabled();

    await user.type(newPasswordInput, 'newPassword');
    expect(saveButton).toBeDisabled();

    await user.type(confirmPasswordInput, 'new');
    await screen.findByText("New password and it's confirmation do not match");
    expect(saveButton).toBeDisabled();
    await user.type(confirmPasswordInput, 'Password');

    // Submit the form
    expect(saveButton).toBeEnabled();
    await user.click(saveButton);

    expect(controller.updateUserPassword).toHaveBeenCalledWith({
      oldPassword: 'oldPassword',
      newPassword: 'newPassword',
    });
  });
});
