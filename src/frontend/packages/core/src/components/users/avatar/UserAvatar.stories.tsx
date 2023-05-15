import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { UserAvatar } from '.';

export default {
  title: 'Users/Avatar',
  component: UserAvatar,
} as Meta<typeof UserAvatar>;

const Template: StoryFn<typeof UserAvatar> = (args) => {
  return <UserAvatar username={'JohnDoe'} />;
};

export const basic = {
  render: Template,
};
