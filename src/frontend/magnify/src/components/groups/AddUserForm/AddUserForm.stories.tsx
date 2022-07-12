import React from 'react';
import AddUserForm from './AddUserForm';
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'Groups/AddUserForm',
  component: AddUserForm,
} as ComponentMeta<typeof AddUserForm>;

const Template: ComponentStory<typeof AddUserForm> = (args) => <AddUserForm {...args} />;

// create the template and stories
export const basicAddUserForm = Template.bind({});
basicAddUserForm.args = {};
