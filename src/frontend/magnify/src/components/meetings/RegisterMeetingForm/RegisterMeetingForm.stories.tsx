import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';
import RegisterMeetingForm from './RegisterMeetingForm';

export default {
  title: 'Meetings/RegisterMeetingForm',
  component: RegisterMeetingForm,
} as ComponentMeta<typeof RegisterMeetingForm>;

const Template: ComponentStory<typeof RegisterMeetingForm> = (args) => (
  <RegisterMeetingForm {...args} />
);

// create the template and stories
export const basicRegisterMeetingForm = Template.bind({});
basicRegisterMeetingForm.args = {
  onSuccess: () => alert('Success!'),
};
