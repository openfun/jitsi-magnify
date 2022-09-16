import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';
import RegisterRoom from './RegisterRoom';

export default {
  title: 'Rooms/RegisterRoom',
  component: RegisterRoom,
} as ComponentMeta<typeof RegisterRoom>;

const Template: ComponentStory<typeof RegisterRoom> = () => <RegisterRoom />;

// create the template and stories
export const basicRegisterRoom = Template.bind({});
