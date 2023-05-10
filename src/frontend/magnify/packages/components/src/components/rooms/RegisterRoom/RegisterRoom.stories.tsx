import { StoryFn, Meta } from '@storybook/react';
import React from 'react';
import { RegisterRoom } from './RegisterRoom';

export default {
  title: 'Rooms/RegisterRoom',
  component: RegisterRoom,
} as Meta<typeof RegisterRoom>;

const Template: StoryFn<typeof RegisterRoom> = () => <RegisterRoom />;

export const basicRegisterRoom = {
  render: Template,
};
