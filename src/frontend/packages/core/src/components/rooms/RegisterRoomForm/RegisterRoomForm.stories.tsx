import { Meta } from '@storybook/react';
import { RegisterRoomForm } from './RegisterRoomForm';

export default {
  title: 'Rooms/RegisterRoomForm',
  component: RegisterRoomForm,
} as Meta<typeof RegisterRoomForm>;

export const basicRegisterRoomForm = {
  args: {
    // eslint-disable-next-line no-alert
    onSuccess: () => alert('Success!'),
  },
};
