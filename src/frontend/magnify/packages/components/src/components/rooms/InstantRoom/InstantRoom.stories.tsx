import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { InstantRoom } from './index';

export default {
  title: 'Rooms/InstantRoom',
  component: InstantRoom,
} as ComponentMeta<typeof InstantRoom>;

const Template: ComponentStory<typeof InstantRoom> = () => <InstantRoom />;

// create the template and stories
export const basic = Template.bind({});
