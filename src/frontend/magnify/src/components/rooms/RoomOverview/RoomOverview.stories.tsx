import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';
import { withRouter } from 'storybook-addon-react-router-v6';
import RoomOverview from './RoomOverview';

export default {
  title: 'Rooms/RoomOverview',
  component: RoomOverview,
  decorators: [withRouter],
} as ComponentMeta<typeof RoomOverview>;

const Template: ComponentStory<typeof RoomOverview> = (args) => <RoomOverview {...args} />;

// create the template and stories
export const basicRoomOverview = Template.bind({});
basicRoomOverview.args = {
  roomSlug: 'room-1',
  baseJitsiUrl: '/jitsi',
};
