import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Box, Card, Text } from 'grommet';
import React from 'react';
import { ConnexionStatus, useStore } from '../../../controller';
import InjectFakeUser from '../../../utils/InjectFakeUser';
import { AuthGard } from '../../auth';

import LayoutWithSidebar, { LayoutWithSidebarProps } from './LayoutWithSidebar';

export default {
  title: 'Sidebar/LayoutWithSidebar',
  component: LayoutWithSidebar,
} as ComponentMeta<typeof LayoutWithSidebar>;

const Template: ComponentStory<typeof LayoutWithSidebar> = (args) => (
  <Box
    background="linear-gradient(45deg, #fef1f3 0%, #d6e4f6 100%);"
    height={{ height: '100vh', min: '100vh' }}
  >
    <InjectFakeUser>
      <LayoutWithSidebar {...args} />
    </InjectFakeUser>
  </Box>
);

// create the template and stories
export const layoutWithSidebarLong = Template.bind({});
layoutWithSidebarLong.args = {
  title: 'LayoutWithSidebarLong',
  children: (
    <Card background="white" pad="medium" width="100%">
      <pre>
        {Array(10)
          .fill(
            `This is the song that never ends
Yes, it goes on and on, my friends
Some people started singing it not knowing what it was
And they'll continue singing it forever just because\n`,
          )
          .join('\n')}
      </pre>
    </Card>
  ),
};

export const layoutWithSidebarShort = Template.bind({});
layoutWithSidebarShort.args = {
  title: 'LayoutWithSidebarShort',
  children: (
    <Card background="white" pad="medium" width="100%">
      Hello
    </Card>
  ),
};
