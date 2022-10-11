import { ComponentStory } from '@storybook/react';
import React from 'react';
import { withRouter } from 'storybook-addon-react-router-v6';
import { useAuthContext } from '../../../context';
import { useStore } from '../../../controller/ControllerProvider';
import LoginForm from './LoginForm';

export default {
  title: 'auth/LoginForm',
  component: LoginForm,
  decorators: [withRouter],
};

const UserDisplayer = () => {
  const { user } = useStore();
  const context = useAuthContext();
  return <pre>AuthContext auth state: {JSON.stringify(context.user, null, 2)}</pre>;
};
const Template: ComponentStory<typeof LoginForm> = () => (
  <div>
    <UserDisplayer />
    <LoginForm />
  </div>
);

export const Simple = Template.bind({});
