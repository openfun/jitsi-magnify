import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { Meeting } from '../../../types';
import { MyMeetings } from './MyMeetings';

export default {
  title: 'Meetings/MyMeetings',
  component: MyMeetings,
} as ComponentMeta<typeof MyMeetings>;

const myMeetings: string | null = localStorage.getItem('meetings');
const myMeetingsList: Meeting[] = myMeetings ? JSON.parse(myMeetings) : [];
const mySortedMeetingsList = myMeetingsList.sort(
  (a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime(),
);

const Template: ComponentStory<typeof MyMeetings> = (args) => (
  <MyMeetings meetings={mySortedMeetingsList} />
);

// create the template and stories
export const basicMyMeetings = Template.bind({});
