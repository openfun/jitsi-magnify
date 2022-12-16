import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';
import { RegisterRoomForm } from './RegisterRoomForm';

export default {
  title: 'Rooms/RegisterRoomForm',
  component: RegisterRoomForm,
} as ComponentMeta<typeof RegisterRoomForm>;

const Template: ComponentStory<typeof RegisterRoomForm> = (args) => <RegisterRoomForm {...args} />;

// create the template and stories
export const basicRegisterRoomForm = Template.bind({});
basicRegisterRoomForm.args = {
  onSuccess: () => alert('Success!'),
};
