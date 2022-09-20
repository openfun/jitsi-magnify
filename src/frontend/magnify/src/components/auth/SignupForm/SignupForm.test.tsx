import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MockController } from '../../../controller';
import ControllerProvider, { useStore } from '../../../controller/ControllerProvider';
import { SignupInput } from '../../../controller/interface';
import { validationMessages } from '../../../i18n/Messages';
import SignupForm from './SignupForm';

const UserDisplayer = () => {
  const { user } = useStore();
  if (!user) return null;
  return (
    <>
      {Object.entries(user).map(([k, v]) => (
        <p key={k}>{`${k}:${v}`}</p>
      ))}
    </>
  );
};

const renderWithController = (controller: MockController) => {
  const user = userEvent.setup();
  render(
    <ControllerProvider controller={controller}>
      <QueryClientProvider client={new QueryClient()}>
        <IntlProvider locale="en">
          <UserDisplayer />
          <SignupForm />
        </IntlProvider>
      </QueryClientProvider>
    </ControllerProvider>,
  );
  return user;
};

const fillInForm = async (
  user: UserEvent,
  input: SignupInput & { passwordConfirm: string } = {
    email: 'valid@test.fr',
    username: 'valid_username',
    password: 'testPassword!',
    passwordConfirm: 'testPassword!',
    name: 'Valid Name',
  },
) => {
  await user.type(screen.getByRole('textbox', { name: 'Name' }), input.passwordConfirm);
  await user.type(screen.getByRole('textbox', { name: 'Email' }), input.email);
  await user.type(screen.getByRole('textbox', { name: 'Username' }), input.username);
  await user.type(screen.getByLabelText('Password'), input.password);
  await user.type(screen.getByLabelText('Confirm Password'), input.passwordConfirm);
  await user.click(screen.getByRole('button', { name: 'Signup' }));
};

describe('SignupForm', () => {
  it('shoud display the errors when the form is invalid', async () => {
    const user = renderWithController(new MockController());

    await fillInForm(user, {
      email: 'invalid@email',
      username: 'invalid@!',
      password: '123',
      passwordConfirm: '1234',
      name: 'valid',
    });

    await screen.findByText('email must be a valid email');
    expect(screen.queryByText(validationMessages.usernameInvalid.defaultMessage)).toBeNull();
    expect(
      await screen.findByText(validationMessages.confirmDoesNotMatch.defaultMessage),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Signup' })).toBeDisabled();
  });
});
