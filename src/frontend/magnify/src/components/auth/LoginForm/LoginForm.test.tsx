import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MockController } from '../../../controller';
import ControllerProvider, { useStore } from '../../../controller/ControllerProvider';
import { createRandomProfile } from '../../../factories/profile';
import LoginForm from './LoginForm';

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
          <LoginForm />
        </IntlProvider>
      </QueryClientProvider>
    </ControllerProvider>,
  );
  return user;
};

const fillInForm = async (user: UserEvent, password: string) => {
  await user.type(screen.getByRole('textbox', { name: 'Username *' }), 'username');
  await user.type(screen.getByLabelText('Password*'), password);
  await user.click(screen.getByRole('button', { name: 'Login' }));
};

describe('LoginForm', () => {
  it('should be possible to login successfully', async () => {
    const controller = new MockController();
    const randomProfile = createRandomProfile();
    controller.login.mockResolvedValue({ access: 'successful-token' });
    controller.getMyProfile.mockResolvedValue(randomProfile);

    const user = renderWithController(controller);
    await fillInForm(user, 'password');

    await screen.findByText(`id:${randomProfile.id}`);
    await screen.findByText(`name:${randomProfile.name}`);
    await screen.findByText(`username:${randomProfile.username}`);
    await screen.findByText(`email:${randomProfile.email}`);
    await screen.findByText(`avatar:${randomProfile.avatar}`);
  });

  it('should raise an error if the credentials are invalid', async () => {
    const controller = new MockController();
    controller.login.mockRejectedValue({ detail: 'Message from the back: invalid credentials' });

    const user = renderWithController(controller);
    await fillInForm(user, 'bad-password');

    await screen.findByText('Message from the back: invalid credentials');
    expect(controller.login).toHaveBeenCalled();
    expect(controller.getMyProfile).not.toHaveBeenCalled();
  });

  it('should display an "unknown" error if the login raise a non handled error', async () => {
    const controller = new MockController();
    controller.login.mockRejectedValue({ message: 'NetworkError' });

    const user = renderWithController(controller);
    await fillInForm(user, 'password');

    await screen.findByText('Something went wrong, please try again later');
    expect(controller.login).toHaveBeenCalled();
    expect(controller.getMyProfile).not.toHaveBeenCalled();
  });
});
