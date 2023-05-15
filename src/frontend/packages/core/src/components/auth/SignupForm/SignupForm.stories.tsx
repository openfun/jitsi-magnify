import { StoryFn } from '@storybook/react';
import React from 'react';
import { withRouter } from 'storybook-addon-react-router-v6';
import { SignupForm } from './SignupForm';

export default {
  title: 'auth/SignupForm',
  component: SignupForm,
  decorators: [withRouter],
};

const Template: StoryFn<typeof SignupForm> = () => (
  <div>
    <SignupForm />
  </div>
);

export const Simple = {
  render: Template,
};
