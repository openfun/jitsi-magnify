import React from 'react';
import IdentityForm from './IdentityForm';
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'profile/IdentityForm',
  component: IdentityForm,
} as ComponentMeta<typeof IdentityForm>;

const Template: ComponentStory<typeof IdentityForm> = (args) => <IdentityForm {...args} />;

// create the template and 2 stories for variants blue and red
export const Simple = Template.bind({});
Simple.args = {
  id: '1',
  name: 'name',
  username: 'username',
  email: 'test@test.fr',
};
