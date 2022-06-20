import React from 'react';
import LayoutWithSidebar from './LayoutWithSidebar';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AppsRounded } from 'grommet-icons';

export default {
  title: 'Sidebar/LayoutWithSidebar',
  component: LayoutWithSidebar,
} as ComponentMeta<typeof LayoutWithSidebar>;

const Template: ComponentStory<typeof LayoutWithSidebar> = (args) => (
  <LayoutWithSidebar {...args}></LayoutWithSidebar>
);

// create the template and stories
export const layoutWithSidebar = Template.bind({});
layoutWithSidebar.args = {};
