import React from 'react';
import AuthGard from './AuthGard';
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'Auth/AuthGard',
  component: AuthGard,
} as ComponentMeta<typeof AuthGard>;

const Template: ComponentStory<typeof AuthGard> = () => <AuthGard />;

// create the template and stories
export const basicAuthGard = Template.bind({});
