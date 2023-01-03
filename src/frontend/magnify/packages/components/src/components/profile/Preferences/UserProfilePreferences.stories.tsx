import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { UserProfilePreferences } from './UserProfilePreferences';

export default {
  title: 'profile/UserProfilePreferences',
  component: UserProfilePreferences,
} as ComponentMeta<typeof UserProfilePreferences>;

const Template: ComponentStory<typeof UserProfilePreferences> = () => <UserProfilePreferences />;

// create the template and 2 stories for variants blue and red
export const Simple = Template.bind({});
