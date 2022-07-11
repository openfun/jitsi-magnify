import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import CreateMeetingInRoomDialog from './CreateMeetingInRoomDialog';

export default {
  title: 'Rooms/CreateMeetingInRoomDialog',
  component: CreateMeetingInRoomDialog,
} as ComponentMeta<typeof CreateMeetingInRoomDialog>;

const Template: ComponentStory<typeof CreateMeetingInRoomDialog> = (args) => (
  <CreateMeetingInRoomDialog {...args} />
);

// create the template and stories
export const basicCreateMeetingInRoomDialog = Template.bind({});
basicCreateMeetingInRoomDialog.args = {
  open: true,
  onClose: () => {},
  roomSlug: 'room-slug',
};
