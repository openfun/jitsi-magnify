import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import createRandomRoom from '../../../factories/rooms';
import { MyRooms } from './MyRooms';

export default {
  title: 'Rooms/MyRooms',
  component: MyRooms,
} as ComponentMeta<typeof MyRooms>;

const Template: ComponentStory<typeof MyRooms> = (args) => (
  <MyRooms {...args} rooms={[createRandomRoom(), createRandomRoom()]} />
);

// create the template and stories
export const basicMyRooms = Template.bind({});
basicMyRooms.args = {
  baseJitsiUrl: 'https://meet.jit.si/',
};
