import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import createRandomUser from '../../../../factories/users';
import { User } from '../../../../types';
import { RoomUsersConfig } from './index';

export default {
  title: 'Rooms/RoomUsersConfig',
  component: RoomUsersConfig,
} as ComponentMeta<typeof RoomUsersConfig>;

const Template: ComponentStory<typeof RoomUsersConfig> = (args) => {
  const search = async (): Promise<User[]> => {
    return [createRandomUser()];
  };
  return <RoomUsersConfig {...args} onSearchUser={search} />;
};

// create the template and stories
export const basic = Template.bind({});
