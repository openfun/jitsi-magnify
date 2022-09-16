import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';
import createRandomRoom from '../../../factories/room';
import RoomRow, { RoomRowProps } from './RoomRow';

export default {
  title: 'Rooms/RoomRow',
  component: RoomRow,
} as ComponentMeta<typeof RoomRow>;

// Template
const Template: ComponentStory<typeof RoomRow> = (args: RoomRowProps) => <RoomRow {...args} />;

// Stories
export const Simple = Template.bind({});
Simple.args = { baseJitsiUrl: '/', room: createRandomRoom() };

export const Admin = Template.bind({});
Admin.args = { baseJitsiUrl: '/', room: createRandomRoom(true) };
