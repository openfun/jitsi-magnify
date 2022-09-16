import { MockController } from '../../../controller';
import { createRandomProfile } from '../../../factories/profile';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import ControllerProvider, { useStore } from '../../../controller/ControllerProvider';
import React from 'react';
import LoginForm from './LoginForm';
import { QueryClient, QueryClientProvider } from 'react-query';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';

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
  await user.type(screen.getByRole('textbox', { name: 'Username' }), 'username');
  await user.type(screen.getByLabelText('Password'), password);
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
  });
});
