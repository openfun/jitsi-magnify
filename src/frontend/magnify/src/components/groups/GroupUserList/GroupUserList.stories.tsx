import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';
import GroupUserList from './GroupUserList';

export default {
  title: 'Groups/GroupUserList',
  component: GroupUserList,
} as ComponentMeta<typeof GroupUserList>;

const Template: ComponentStory<typeof GroupUserList> = (args) => <GroupUserList {...args} />;

// create the template and stories
export const basicGroupUserList = Template.bind({});
basicGroupUserList.args = {};
