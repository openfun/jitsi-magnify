import React from 'react';
import JitsiMeeting from './JitsiMeeting';
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'Jitsi/JitsiMeeting',
  component: JitsiMeeting,
} as ComponentMeta<typeof JitsiMeeting>;

const Template: ComponentStory<typeof JitsiMeeting> = (args) => (
  <JitsiMeeting {...args} key={args.meetingId || args.roomSlug} />
);

// create the template and stories
export const joinExistantJitsiMeeting = Template.bind({});
joinExistantJitsiMeeting.args = {
  meetingId: 'my-meeting-id',
};

export const joinExistantJitsiRoomWith1Meeting = Template.bind({});
joinExistantJitsiRoomWith1Meeting.args = {
  roomSlug: 'my-room-slug',
};

export const joinExistantJitsiRoomWith0Meetings = Template.bind({});
joinExistantJitsiRoomWith0Meetings.args = {
  roomSlug: 'my-room-with-no-meetings',
};

export const joinExistantJitsiRoomWith2Meetings = Template.bind({});
joinExistantJitsiRoomWith2Meetings.args = {
  roomSlug: 'my-room-with2-meetings',
};

export const joinInnexistantJitsiRoom = Template.bind({});
joinInnexistantJitsiRoom.args = {
  roomSlug: 'my-innexistant-room',
};
