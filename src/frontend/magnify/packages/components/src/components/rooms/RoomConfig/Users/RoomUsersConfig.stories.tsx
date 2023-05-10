import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import createRandomRoom from '../../../../factories/rooms';
import { RoomUsersConfig } from './RoomUsersConfig';

export default {
  title: 'Rooms/RoomUserConfig',
  component: RoomUsersConfig,
} as Meta<typeof RoomUsersConfig>;

export const admin = {
  args: {
    room: createRandomRoom(),
  },
};

export const member = {
  args: {
    room: createRandomRoom(false),
  },
};
