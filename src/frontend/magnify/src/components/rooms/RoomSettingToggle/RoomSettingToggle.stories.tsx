import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import RoomSettingToggle from './RoomSettingToggle';

export default {
  title: 'Rooms/RoomSettingToggle',
  component: RoomSettingToggle,
} as ComponentMeta<typeof RoomSettingToggle>;

const Template: ComponentStory<typeof RoomSettingToggle> = (args) => (
  <RoomSettingToggle {...args} />
);

// create the template and stories
export const settingToggle = Template.bind({});
settingToggle.args = {
  label: 'Setting Toggle',
  checked: true,
  settingKey: 'chatEnabled',
  roomName: 'room-1',
};

export const loadingSettingToggle = Template.bind({});
loadingSettingToggle.args = {
  label: 'Loading Setting Toggle',
  settingKey: 'chatEnabled',
  roomName: 'room-1',
};
