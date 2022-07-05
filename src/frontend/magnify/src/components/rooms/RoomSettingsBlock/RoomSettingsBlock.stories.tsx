import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import createRandomRoom from '../../../factories/room';
import RoomSettingsBlock from './RoomSettingsBlock';

export default {
  title: 'Rooms/RoomSettingsBlock',
  component: RoomSettingsBlock,
} as ComponentMeta<typeof RoomSettingsBlock>;

const Template: ComponentStory<typeof RoomSettingsBlock> = (args) => (
  <RoomSettingsBlock {...args} />
);

// create the template and stories
const room = createRandomRoom();

export const horizontalBlock = Template.bind({});
horizontalBlock.args = {
  title: 'Settings',
  room: room,
  roomName: room.name,
  toggles: [
    [
      { label: 'Enable chat', settingKey: 'chatEnabled' },
      { label: 'Enable screen sharing', settingKey: 'screenSharingEnabled' },
      { label: 'Ask for password', settingKey: 'askForPassword' },
    ],
  ],
};
export const verticalBlock = Template.bind({});
verticalBlock.args = {
  title: 'Settings',
  room: room,
  roomName: room.name,
  toggles: [
    [{ label: 'Enable chat', settingKey: 'chatEnabled' }],
    [{ label: 'Enable screen sharing', settingKey: 'screenSharingEnabled' }],
    [{ label: 'Ask for password', settingKey: 'askForPassword' }],
  ],
};

export const togglesStructureEdgeCase = Template.bind({});
togglesStructureEdgeCase.args = {
  title: 'Settings',
  room: room,
  roomName: room.name,
  toggles: [
    [
      { label: 'Enable chat', settingKey: 'chatEnabled' },
      { label: 'Enable screen sharing', settingKey: 'screenSharingEnabled' },
      { label: 'Everyone starts without camera', settingKey: 'everyoneStartsWithoutCamera' },
    ],
    [{ label: 'Ask for password', settingKey: 'askForPassword' }],
    [
      { label: 'Ask for authentication', settingKey: 'askForAuthentication' },
      { label: 'Everyone is muted by default', settingKey: 'everyoneStartsMuted' },
    ],
  ],
};

export const blockWithDescription = Template.bind({});
blockWithDescription.args = {
  title: 'Settings',
  description: 'This is a description',
  room: room,
  roomName: room.name,
  toggles: [[{ label: 'Enable chat', settingKey: 'chatEnabled' }]],
};
