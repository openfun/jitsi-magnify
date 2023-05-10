import { StoryFn, Meta } from '@storybook/react';
import React from 'react';
import { PasswordUpdateBlock } from './PasswordUpdateBlock';

export default {
  title: 'profile/PasswordUpdateBlock',
  component: PasswordUpdateBlock,
} as Meta<typeof PasswordUpdateBlock>;

const Template: StoryFn<typeof PasswordUpdateBlock> = () => <PasswordUpdateBlock />;

export const Simple = {
  render: Template,
  args: {},
};
