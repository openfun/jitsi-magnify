import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import IdentityForm from './IdentityForm';

export default {
  title: 'profile/IdentityForm',
  component: IdentityForm,
} as ComponentMeta<typeof IdentityForm>;

const Template: ComponentStory<typeof IdentityForm> = () => <IdentityForm />;

// create the template and 2 stories for variants blue and red
export const Simple = Template.bind({});
Simple.args = {
  id: '1',
  name: 'name',
  username: 'username',
  email: 'test@test.fr',
};
