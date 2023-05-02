import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { validationMessages } from '../../../i18n/Messages';
import { MagnifyLocales } from '../../../utils';
import { renderWrappedInTestingProvider } from '../../../utils/test-utils';
import { SignupForm, SignupFormValues } from './SignupForm';

describe('SignupForm', () => {
  it('shoud display the errors when the form is invalid', async () => {
    const user = userEvent.setup();
    renderWrappedInTestingProvider(<SignupForm />);

    const input: SignupFormValues = {
      email: 'invalid@email',
      username: 'invalid@!',
      password: '123',
      confirmPassword: '1234',
      name: 'valid',
      language: MagnifyLocales.EN,
    };

    await act(async () => {
      await user.type(screen.getByRole('textbox', { name: 'Name' }), input.confirmPassword);
      await user.type(screen.getByRole('textbox', { name: 'Email' }), input.email);
      await user.type(screen.getByRole('textbox', { name: 'Username' }), input.username);
      await user.type(screen.getByLabelText('Password'), input.password);
      await user.type(screen.getByLabelText('Confirm Password'), input.confirmPassword);
      await user.click(screen.getByRole('button', { name: 'Signup' }));
    });

    await screen.findByText('email must be a valid email');
    expect(screen.queryByText(validationMessages.usernameInvalid.defaultMessage)).toBeNull();
    expect(
      await screen.findByText(validationMessages.confirmDoesNotMatch.defaultMessage),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Signup' })).toBeDisabled();
  });
});
