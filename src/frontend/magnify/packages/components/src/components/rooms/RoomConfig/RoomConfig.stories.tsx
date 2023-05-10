import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import createRandomRoom from '../../../factories/rooms';
import { RoomConfig } from './RoomConfig';

export default {
  title: 'Rooms/RoomConfig',
  component: RoomConfig,
} as Meta<typeof RoomConfig>;

const Template: StoryFn<typeof RoomConfig> = (args) => (
  <RoomConfig {...args} room={createRandomRoom()} />
);

export const roomConfigPage = {
  render: Template,
};
