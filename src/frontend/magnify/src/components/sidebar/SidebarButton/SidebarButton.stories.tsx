import { ComponentMeta, ComponentStory } from '@storybook/react';
import { AppsRounded } from 'grommet-icons';
import React from 'react';

import SidebarButton from './SidebarButton';

export default {
  title: 'Sidebar/SidebarButton',
  component: SidebarButton,
} as ComponentMeta<typeof SidebarButton>;

const Template: ComponentStory<typeof SidebarButton> = (args) => <SidebarButton {...args} />;

// create the template and stories
export const basicButton = Template.bind({});
basicButton.args = {
  disabled: false,
  label: 'My button',
  navigateTo: 'a',
  icon: <AppsRounded />,
};
