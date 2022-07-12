import React from 'react';
import AddGroupForm from './AddGroupForm';
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'Groups/AddGroupForm',
  component: AddGroupForm,
} as ComponentMeta<typeof AddGroupForm>;

const Template: ComponentStory<typeof AddGroupForm> = (args) => <AddGroupForm {...args} />;

// create the template and stories
export const basicAddGroupForm = Template.bind({});
basicAddGroupForm.args = {};
