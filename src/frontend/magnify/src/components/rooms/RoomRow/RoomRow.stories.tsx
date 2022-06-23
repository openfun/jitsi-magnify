import React from 'react';
import RoomRow, { RoomRowProps } from './RoomRow';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import createRandomRoom from '../../../factories/room';

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
