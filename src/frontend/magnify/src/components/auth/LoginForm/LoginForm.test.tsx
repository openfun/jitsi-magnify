import userEvent from '@testing-library/user-event';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import React from 'react';
import { MockController } from '../../../controller';
import { useStore } from '../../../controller/ControllerProvider';
import { createRandomProfile } from '../../../factories/profile';
import { render, screen } from '../../../utils/test-utils';
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
  render(<LoginForm />);
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
