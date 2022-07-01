import React from 'react';
import UserMenu from './UserMenu';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import InjectFakeUser from '../../../utils/InjectFakeUser';

export default {
  title: 'Auth/UserMenu',
  component: UserMenu,
} as ComponentMeta<typeof UserMenu>;

const Template: ComponentStory<typeof UserMenu> = (args) => {
  return (
    <InjectFakeUser>
      <UserMenu {...args} />
    </InjectFakeUser>
  );
};

// create the template and stories
export const basicUserMenu = Template.bind({});
basicUserMenu.args = {};
