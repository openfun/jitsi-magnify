import React from 'react';
import RoomOverview from './RoomOverview';
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'Rooms/RoomOverview',
  component: RoomOverview,
} as ComponentMeta<typeof RoomOverview>;

const Template: ComponentStory<typeof RoomOverview> = (args) => <RoomOverview {...args} />;

// create the template and stories
export const basicRoomOverview = Template.bind({});
basicRoomOverview.args = {
  roomSlug: 'room-1',
  baseJitsiUrl: '/jitsi',
};
