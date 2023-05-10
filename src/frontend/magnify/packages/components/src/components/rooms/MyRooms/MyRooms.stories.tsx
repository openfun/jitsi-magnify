import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import createRandomRoom from '../../../factories/rooms';
import { MyRooms } from './MyRooms';

export default {
  title: 'Rooms/MyRooms',
  component: MyRooms,
} as Meta<typeof MyRooms>;

const Template: StoryFn<typeof MyRooms> = (args) => (
  <MyRooms {...args} rooms={[createRandomRoom(), createRandomRoom()]} />
);

export const basicMyRooms = {
  render: Template,

  args: {
    baseJitsiUrl: 'https://meet.jit.si/',
  },
};
