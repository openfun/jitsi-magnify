import React from 'react';
import GroupsList, { GroupsListProps } from './GroupsList';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { mockedGroups } from './mocks';
import { ResponsiveContext } from 'grommet';

export default {
  title: 'Groups/GroupsList',
  component: GroupsList,
} as ComponentMeta<typeof GroupsList>;

//Test component that wraps GroupsList within a ResponsiveContext.Provider with given size
interface GroupsListWithinResponsiveContextProps extends GroupsListProps {
  width: number;
  size: 'small' | 'medium' | 'large';
}
const GroupsListWithinResponsiveContext = ({
  width,
  size,
  ...rest
}: GroupsListWithinResponsiveContextProps) => {
  return (
    <ResponsiveContext.Provider value={size}>
      <div style={{ width: `${width}px` }}>
        <GroupsList {...rest} />
      </div>
    </ResponsiveContext.Provider>
  );
};

// Template
const Template: ComponentStory<typeof GroupsListWithinResponsiveContext> = (
  args: GroupsListWithinResponsiveContextProps,
) => <GroupsListWithinResponsiveContext {...args} />;

// Stories
export const GroupsList500px = Template.bind({});
GroupsList500px.args = { width: 500, size: 'small', groups: mockedGroups };

export const GroupsList800px = Template.bind({});
GroupsList800px.args = { width: 800, size: 'medium', groups: mockedGroups };
