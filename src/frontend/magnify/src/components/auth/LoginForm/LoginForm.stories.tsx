import { ComponentStory } from '@storybook/react';
import React from 'react';
import { useStore } from '../../../controller/ControllerProvider';
import LoginForm from './LoginForm';

export default {
  title: 'auth/LoginForm',
  component: LoginForm,
};

const UserDisplayer = () => {
  const { user } = useStore();
  return <pre>Controller auth state: {JSON.stringify({ user }, null, 2)}</pre>;
};
const Template: ComponentStory<typeof LoginForm> = () => (
  <div>
    <pre>
      Use &quot;username&quot;, &quot;password&quot; for a successful Login{'\n'}
      Use &quot;username&quot;, &quot;bad-password&quot; for a failed Login
    </pre>
    <UserDisplayer />
    <LoginForm />
  </div>
);

export const Simple = Template.bind({});
