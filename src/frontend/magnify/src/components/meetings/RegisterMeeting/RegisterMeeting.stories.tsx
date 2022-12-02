import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';
import RegisterMeeting from './RegisterMeeting';

export default {
  title: 'Meetings/RegisterMeeting',
  component: RegisterMeeting,
} as ComponentMeta<typeof RegisterMeeting>;

const Template: ComponentStory<typeof RegisterMeeting> = () => <RegisterMeeting />;

// create the template and stories
export const basicRegisterMeeting = Template.bind({});
