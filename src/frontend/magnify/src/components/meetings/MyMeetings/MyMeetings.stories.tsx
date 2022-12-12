import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { createRandomMeeting } from '../../../factories/meetings';
import { MyMeetings } from './MyMeetings';

export default {
  title: 'Meetings/MyMeetings',
  component: MyMeetings,
} as ComponentMeta<typeof MyMeetings>;

const Template: ComponentStory<typeof MyMeetings> = (args) => (
  <MyMeetings meetings={[createRandomMeeting(), createRandomMeeting()]} />
);

// create the template and stories
export const basicMyMeetings = Template.bind({});
