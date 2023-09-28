import { Meta } from '@storybook/react';
import { createRandomRoom } from '../../../../factories';
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
