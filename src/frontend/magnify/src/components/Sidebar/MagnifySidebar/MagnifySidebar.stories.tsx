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
        to: 'a',
        icon: <AppsRounded />,
      },
      {
        label: 'Button B',
        to: 'b',
        icon: <AppsRounded />,
      },
    ],
    [
      {
        label: 'Button C',
        to: 'c',
        icon: <AppsRounded />,
      },
      {
        label: 'Button D',
        to: 'd',
        icon: <AppsRounded />,
      },
    ],
  ],
};
