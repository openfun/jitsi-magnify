import React from 'react';
import MyRooms from './MyRooms';
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'Rooms/MyRooms',
  component: MyRooms,
} as ComponentMeta<typeof MyRooms>;

const Template: ComponentStory<typeof MyRooms> = (args) => <MyRooms {...args} />;

// create the template and stories
export const basicMyRooms = Template.bind({});
basicMyRooms.args = {
  baseJitsiUrl: 'https://meet.jit.si/',
};
