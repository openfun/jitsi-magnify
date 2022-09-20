import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';
import TextField from './TextField';

export default {
  title: 'DesignSystem/TextField',
  component: TextField,
} as ComponentMeta<typeof TextField>;

const Template: ComponentStory<typeof TextField> = (args) => <TextField {...args} />;

const baseArgs = {
  label: 'My input',
  name: 'my-input',
  onChange: console.log,
  value: 'xxx',
};

// create the template and 2 stories for variants blue and red
export const Simple = Template.bind({});
Simple.args = { ...baseArgs };

export const WithMargin = Template.bind({});
WithMargin.args = {
  ...baseArgs,
  margin: 'large',
};

export const WithErrors = Template.bind({});
WithErrors.args = {
  ...baseArgs,
  errors: ['This is an error'],
};

export const Required = Template.bind({});
Required.args = {
  ...baseArgs,
  required: true,
};

export const Password = Template.bind({});
Password.args = {
  ...baseArgs,
  type: 'password',
};
