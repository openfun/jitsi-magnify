import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MockController } from '../../../controller';
import ControllerProvider, { useStore } from '../../../controller/ControllerProvider';
import { SignupInput } from '../../../controller/interface';
import { createRandomProfile } from '../../../factories/profile';
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
  await user.type(screen.getByRole('textbox', { name: 'Name *' }), input.passwordConfirm);
  await user.type(screen.getByRole('textbox', { name: 'Email *' }), input.email);
  await user.type(screen.getByRole('textbox', { name: 'Username *' }), input.username);
  await user.type(screen.getByLabelText('Password*'), input.password);
  await user.type(screen.getByLabelText('Confirm Password*'), input.passwordConfirm);
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

    await screen.findByText('Email is invalid');
    await screen.findByText(
      'Username is invalid, it should have between 3 and 16 letters, numbers or underscores',
    );
    await screen.findByText("New password and it's confirmation do not match");
    expect(screen.getByRole('button', { name: 'Signup' })).toBeDisabled();
  });

  it('should be possible to signup successfully', async () => {
    const controller = new MockController();
    const randomProfile = createRandomProfile();
    controller.signup.mockResolvedValue({ access: 'successful-token' });
    controller.getMyProfile.mockResolvedValue(randomProfile);

    const user = renderWithController(controller);
    await fillInForm(user);

    await screen.findByText(`id:${randomProfile.id}`);
    await screen.findByText(`name:${randomProfile.name}`);
    await screen.findByText(`username:${randomProfile.username}`);
    await screen.findByText(`email:${randomProfile.email}`);
    await screen.findByText(`avatar:${randomProfile.avatar}`);
  });

  it('should raise an error if the credentials are invalid', async () => {
    const controller = new MockController();
    controller.signup.mockRejectedValue({
      username: ['message from the back: username not available'],
      email: ['message from the back: email not available'],
    });

    const user = renderWithController(controller);
    await fillInForm(user);

    await screen.findByText('message from the back: username not available');
    await screen.findByText('message from the back: email not available');
    expect(controller.signup).toHaveBeenCalled();
    expect(controller.getMyProfile).not.toHaveBeenCalled();
  });

  it('should display an "unknown" error if the signup raise a non handled error', async () => {
    const controller = new MockController();
    controller.signup.mockRejectedValue({ message: 'NetworkError' });

    const user = renderWithController(controller);
    await fillInForm(user);

    await screen.findByText('Something went wrong, please try again later');
    expect(controller.signup).toHaveBeenCalled();
    expect(controller.getMyProfile).not.toHaveBeenCalled();
  });
});
