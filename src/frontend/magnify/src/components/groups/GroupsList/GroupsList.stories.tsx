import React from 'react';
import GroupsList, { GroupsListProps } from './GroupsList';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ResponsiveContext } from 'grommet';
import createRandomGroup from '../../../factories/group';

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

// Mocks
const mockedGroups = [
  createRandomGroup(3, 7),
  createRandomGroup(9),
  createRandomGroup(23),
  createRandomGroup(1),
];

// Stories
export const GroupsList500px = Template.bind({});
GroupsList500px.args = { width: 500, size: 'small', groups: mockedGroups };

export const GroupsList800px = Template.bind({});
GroupsList800px.args = { width: 800, size: 'medium', groups: mockedGroups };

export const GroupsListNoGroup = Template.bind({});
GroupsListNoGroup.args = { width: 800, size: 'medium', groups: [] };

export const GroupList1Group = Template.bind({});
GroupList1Group.args = { width: 800, size: 'medium', groups: [createRandomGroup(3, 7)] };
