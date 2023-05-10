import { StoryFn, Meta } from '@storybook/react';
import React from 'react';
import { PasswordUpdateForm } from './PasswordUpdateForm';

export default {
  title: 'profile/PasswordUpdateForm',
  component: PasswordUpdateForm,
} as Meta<typeof PasswordUpdateForm>;

const Template: StoryFn<typeof PasswordUpdateForm> = () => <PasswordUpdateForm />;

export const Simple = {
  render: Template,
};
