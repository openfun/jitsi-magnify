import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';
import { AvatarForm } from './AvatarForm';

export default {
  title: 'profile/AvatarForm',
  component: AvatarForm,
} as ComponentMeta<typeof AvatarForm>;

const Template: ComponentStory<typeof AvatarForm> = (args) => <AvatarForm {...args} />;

// create the template and 2 stories for variants blue and red
export const Simple = Template.bind({});
Simple.args = {
  id: '1',
  src: 'https://i.pravatar.cc/120?img=12',
};

export const NoImage = Template.bind({});
NoImage.args = {};
