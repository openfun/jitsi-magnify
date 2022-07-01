import React, { useEffect } from 'react';
import UserMenu from './UserMenu';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ConnexionStatus, useStore } from '../../../controller';
import AuthGard from '../AuthGard';
import { createRandomProfile } from '../../../factories/profile';

export default {
  title: 'Auth/UserMenu',
  component: UserMenu,
} as ComponentMeta<typeof UserMenu>;

/**
 * Prepare the store to have an user in it
 */
const GardedUserMenu = () => {
  const { setStore } = useStore();

  useEffect(() => {
    setStore({
      connexionStatus: ConnexionStatus.CONNECTED,
      user: createRandomProfile(),
    });
  }, []);

  return <UserMenu />;
};

const Template: ComponentStory<typeof UserMenu> = (args) => {
  return <GardedUserMenu />;
};

// create the template and stories
export const basicUserMenu = Template.bind({});
basicUserMenu.args = {};
