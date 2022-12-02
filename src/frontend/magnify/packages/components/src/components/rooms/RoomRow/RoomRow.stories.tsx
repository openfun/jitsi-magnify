import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { withRouter } from 'storybook-addon-react-router-v6';
import createRandomRoom from '../../../factories/rooms';
import { RoomRow, RoomRowProps } from './RoomRow';

export default {
  title: 'Rooms/RoomRow',
  component: RoomRow,
  decorators: [withRouter],
} as ComponentMeta<typeof RoomRow>;

// Template
const Template: ComponentStory<typeof RoomRow> = (args: RoomRowProps) => <RoomRow {...args} />;

// Stories
export const Simple = Template.bind({});
Simple.args = { baseJitsiUrl: '/', room: createRandomRoom() };

export const Admin = Template.bind({});
Admin.args = { baseJitsiUrl: '/', room: createRandomRoom(true) };
