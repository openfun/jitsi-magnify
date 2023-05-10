import { StoryFn, Meta } from '@storybook/react';
import React from 'react';
import { RegisterRoomForm } from './RegisterRoomForm';

export default {
  title: 'Rooms/RegisterRoomForm',
  component: RegisterRoomForm,
} as Meta<typeof RegisterRoomForm>;

export const basicRegisterRoomForm = {
  args: {
    onSuccess: () => alert('Success!'),
  },
};
