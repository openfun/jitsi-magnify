import { ComponentStory } from '@storybook/react';
import React from 'react';
import { withRouter } from 'storybook-addon-react-router-v6';
import { useStore } from '../../../controller/ControllerProvider';
import SignupForm from './SignupForm';

export default {
  title: 'auth/SignupForm',
  component: SignupForm,
  decorators: [withRouter],
};

const UserDisplayer = () => {
  const { user } = useStore();
  return <pre>Controller auth state: {JSON.stringify({ user }, null, 2)}</pre>;
};
const Template: ComponentStory<typeof SignupForm> = () => (
  <div>
    <pre>
      Use &quot;test&quot;, &quot;bad-email@test.fr&quot;, &quot;bad_username&quot;,
      &quot;test1234&quot; for a failed Login
    </pre>
    <UserDisplayer />
    <SignupForm />
  </div>
);

export const Simple = Template.bind({});
