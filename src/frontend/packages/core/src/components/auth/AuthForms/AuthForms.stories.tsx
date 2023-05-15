import { StoryFn } from '@storybook/react';
import React from 'react';
import { AuthForms } from './AuthForms';

export default {
  title: 'auth/AuthForms',
  component: AuthForms,
};

const Template: StoryFn<typeof AuthForms> = () => <AuthForms isLogin={true}>Hello !</AuthForms>;

export const Simple = {
  render: Template,
};
