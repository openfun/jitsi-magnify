import React from 'react';
import PasswordUpdateForm from './PasswordUpdateForm';
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'profile/PasswordUpdateForm',
  component: PasswordUpdateForm,
} as ComponentMeta<typeof PasswordUpdateForm>;

const Template: ComponentStory<typeof PasswordUpdateForm> = () => <PasswordUpdateForm />;

// create the template and 2 stories for variants blue and red
export const Simple = Template.bind({});
