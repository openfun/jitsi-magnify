import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';
import { PasswordUpdateBlock } from './PasswordUpdateBlock';

export default {
  title: 'profile/PasswordUpdateBlock',
  component: PasswordUpdateBlock,
} as ComponentMeta<typeof PasswordUpdateBlock>;

const Template: ComponentStory<typeof PasswordUpdateBlock> = () => <PasswordUpdateBlock />;

// create the template and 2 stories for variants blue and red
export const Simple = Template.bind({});
Simple.args = {};
