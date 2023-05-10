import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { withRouter } from 'storybook-addon-react-router-v6';
import createRandomRoom from '../../../factories/rooms';
import { RoomRow, RoomRowProps } from './RoomRow';

export default {
  title: 'Rooms/RoomRow',
  component: RoomRow,
  decorators: [withRouter],
} as Meta<typeof RoomRow>;

export const Simple = {
  args: { baseJitsiUrl: '/', room: createRandomRoom() },
};

export const Admin = {
  args: { baseJitsiUrl: '/', room: createRandomRoom(true) },
};
