import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { UserAvatar } from '.';

export default {
  title: 'Users/Avatar',
  component: UserAvatar,
} as ComponentMeta<typeof UserAvatar>;

const Template: ComponentStory<typeof UserAvatar> = (args) => {
  return <UserAvatar username={'JohnDoe'} />;
};

// create the template and stories
export const basic = Template.bind({});
