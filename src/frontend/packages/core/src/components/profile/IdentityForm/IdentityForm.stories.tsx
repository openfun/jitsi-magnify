import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { IdentityForm } from './IdentityForm';

export default {
  title: 'profile/IdentityForm',
  component: IdentityForm,
} as Meta<typeof IdentityForm>;

const Template: StoryFn<typeof IdentityForm> = () => <IdentityForm />;

export const Simple = {
  render: Template,

  args: {
    id: '1',
    name: 'name',
    username: 'username',
    email: 'test@test.fr',
  },
};
