import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';
import AddGroupToRoomDialog from './AddGroupToRoomDialog';

export default {
  title: 'Rooms/AddGroupToRoomDialog',
  component: AddGroupToRoomDialog,
} as ComponentMeta<typeof AddGroupToRoomDialog>;

const Template: ComponentStory<typeof AddGroupToRoomDialog> = (args) => (
  <AddGroupToRoomDialog {...args} />
);

// create the template and stories
export const basicAddGroupToRoomDialog = Template.bind({});
basicAddGroupToRoomDialog.args = {
  open: true,
  onClose: () => {},
  roomSlug: 'room-slug',
};
