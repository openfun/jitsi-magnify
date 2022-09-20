import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';
import InjectFakeUser from '../../../utils/InjectFakeUser';
import UserMenu from './UserMenu';

export default {
  title: 'Auth/UserMenu',
  component: UserMenu,
} as ComponentMeta<typeof UserMenu>;

const Template: ComponentStory<typeof UserMenu> = () => {
  return (
    <InjectFakeUser>
      <UserMenu />
    </InjectFakeUser>
  );
};

// create the template and stories
export const basicUserMenu = Template.bind({});
basicUserMenu.args = {};
