import { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import { UserProfilePreferences } from './UserProfilePreferences';

export default {
  title: 'profile/UserProfilePreferences',
  component: UserProfilePreferences,
} as Meta<typeof UserProfilePreferences>;

const Template: StoryFn<typeof UserProfilePreferences> = () => <UserProfilePreferences />;

export const Simple = {
  render: Template,
};
