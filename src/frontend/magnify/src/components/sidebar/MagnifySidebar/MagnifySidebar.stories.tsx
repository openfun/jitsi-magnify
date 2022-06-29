import React from 'react';
import LayoutWithSidebar from './MagnifySidebar';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AppsRounded } from 'grommet-icons';

export default {
  title: 'Sidebar/MagnifySidebar',
  component: LayoutWithSidebar,
} as ComponentMeta<typeof LayoutWithSidebar>;

const Template: ComponentStory<typeof LayoutWithSidebar> = (args) => (
  <LayoutWithSidebar {...args}></LayoutWithSidebar>
);

// create the template and stories
export const customSidebar = Template.bind({});
customSidebar.args = {
  itemZones: [
    [
      {
        label: 'Button A',
        navigateTo: 'a',
        icon: <AppsRounded />,
      },
      {
        label: 'Button B',
        navigateTo: 'b',
        icon: <AppsRounded />,
      },
    ],
    [
      {
        label: 'Button C',
        navigateTo: 'c',
        icon: <AppsRounded />,
      },
      {
        label: 'Button D',
        navigateTo: 'd',
        icon: <AppsRounded />,
      },
    ],
  ],
};

export const magnifySidebar = Template.bind({});
magnifySidebar.args = {
  itemZones: undefined,
};
