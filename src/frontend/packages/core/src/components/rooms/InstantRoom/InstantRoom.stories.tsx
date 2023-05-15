import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { InstantRoom } from './index';

export default {
  title: 'Rooms/InstantRoom',
  component: InstantRoom,
} as Meta<typeof InstantRoom>;

const Template: StoryFn<typeof InstantRoom> = () => <InstantRoom />;

export const basic = {
  render: Template,
};
