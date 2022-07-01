import { ComponentStory } from '@storybook/react';
import React from 'react';
import AuthForms from './AuthForms';

export default {
  title: 'auth/AuthForms',
  component: AuthForms,
};

const Template: ComponentStory<typeof AuthForms> = () => <AuthForms />;

export const Simple = Template.bind({});
