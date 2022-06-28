import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Box } from 'grommet';
import React from 'react';
import LayoutWithSidebar from './LayoutWithSidebar';

export default {
  title: 'Sidebar/LayoutWithSidebar',
  component: LayoutWithSidebar,
} as ComponentMeta<typeof LayoutWithSidebar>;

const Template: ComponentStory<typeof LayoutWithSidebar> = (args) => (
  <Box background={'light-3'}>
    <LayoutWithSidebar {...args}></LayoutWithSidebar>
  </Box>
);

// create the template and stories
export const layoutWithSidebar = Template.bind({});
layoutWithSidebar.args = {};
