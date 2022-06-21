import React from 'react';
import IdentityBlock from './IdentityBlock';
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'profile/IdentityBlock',
  component: IdentityBlock,
} as ComponentMeta<typeof IdentityBlock>;

const Template: ComponentStory<typeof IdentityBlock> = (args) => <IdentityBlock {...args} />;

// create the template and 2 stories for variants blue and red
export const Simple = Template.bind({});
Simple.args = {
  name: 'name',
  username: 'username',
  email: 'test@test.fr',
  avatar: 'https://i.pravatar.cc/120?img=12',
};
