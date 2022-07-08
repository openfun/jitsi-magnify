import React from 'react';
import CreateMeetingForm from './CreateMeetingForm';
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'Meetings/CreateMeetingForm',
  component: CreateMeetingForm,
} as ComponentMeta<typeof CreateMeetingForm>;

const Template: ComponentStory<typeof CreateMeetingForm> = (args) => (
  <CreateMeetingForm {...args} />
);

// create the template and stories
export const basicCreateMeetingForm = Template.bind({});
basicCreateMeetingForm.args = {};
