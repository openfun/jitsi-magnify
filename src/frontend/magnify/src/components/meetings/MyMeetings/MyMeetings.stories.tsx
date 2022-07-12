import React from 'react';
import MyMeetings from './MyMeetings';
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'Meetings/MyMeetings',
  component: MyMeetings,
} as ComponentMeta<typeof MyMeetings>;

const Template: ComponentStory<typeof MyMeetings> = (args) => <MyMeetings {...args} />;

// create the template and stories
export const basicMyMeetings = Template.bind({});
basicMyMeetings.args = {
  baseJitsiUrl: '',
};
