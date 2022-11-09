import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { RoomConfig } from './RoomConfig';

export default {
  title: 'Rooms/RoomConfig',
  component: RoomConfig,
} as ComponentMeta<typeof RoomConfig>;

const Template: ComponentStory<typeof RoomConfig> = (args) => <RoomConfig {...args} />;

// create the template and stories
export const roomConfigPage = Template.bind({});
