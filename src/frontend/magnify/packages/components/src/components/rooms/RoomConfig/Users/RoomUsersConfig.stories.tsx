import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import createRandomRoom from '../../../../factories/rooms';
import { RoomUsersConfig } from './RoomUsersConfig';

export default {
  title: 'Rooms/RoomUserConfig',
  component: RoomUsersConfig,
} as ComponentMeta<typeof RoomUsersConfig>;

const Template: ComponentStory<typeof RoomUsersConfig> = (args) => <RoomUsersConfig {...args} />;

// create the template and stories
export const admin = Template.bind({});
admin.args = {
  room: createRandomRoom(),
};

export const member = Template.bind({});
member.args = {
  room: createRandomRoom(false),
};
