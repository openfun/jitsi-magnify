import React from 'react';
import MyGroupsBlock from './MyGroupsBlock';
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'Groups/MyGroupsBlock',
  component: MyGroupsBlock,
} as ComponentMeta<typeof MyGroupsBlock>;

const Template: ComponentStory<typeof MyGroupsBlock> = () => <MyGroupsBlock />;

// create the template and stories
export const basicMyGroupsBlock = Template.bind({});
