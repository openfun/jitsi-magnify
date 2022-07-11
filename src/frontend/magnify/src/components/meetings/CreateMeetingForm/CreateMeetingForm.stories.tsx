import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import CreateMeetingForm from './CreateMeetingForm';

export default {
  title: 'Meetings/CreateMeetingForm',
  component: CreateMeetingForm,
} as ComponentMeta<typeof CreateMeetingForm>;

const Template: ComponentStory<typeof CreateMeetingForm> = (args) => (
  <CreateMeetingForm {...args} />
);

// create the template and stories
export const basicCreateMeetingForm = Template.bind({});
basicCreateMeetingForm.args = {
  onCancel: undefined,
};

export const createMeetingFormWithCancel = Template.bind({});
createMeetingFormWithCancel.args = {
  onCancel: () => {},
};
