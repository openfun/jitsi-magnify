import React from 'react';
import GroupsList, { GroupsListProps } from './GroupsList';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Context as ResponsiveContext } from 'react-responsive';
import { mockedGroups } from './mocks';

export default {
  title: 'Groups/GroupsList',
  component: GroupsList,
} as ComponentMeta<typeof GroupsList>;

//Test component that wraps GroupsList within a ResponsiveContext.Provider with given size
interface GroupsListWithinResponsiveContextProps extends GroupsListProps {
  width: number;
}
const GroupsListWithinResponsiveContext = (props: GroupsListWithinResponsiveContextProps) => {
  return (
    <ResponsiveContext.Provider value={{ width: props.width }}>
      <div style={{ width: `${props.width}px` }}>
        <GroupsList {...props} />
      </div>
    </ResponsiveContext.Provider>
  );
};
const onToogle = console.log;

// Template
const Template: ComponentStory<typeof GroupsListWithinResponsiveContext> = (
  args: GroupsListWithinResponsiveContextProps,
) => <GroupsListWithinResponsiveContext {...args} />;

// Stories
export const GroupsList400px = Template.bind({});
GroupsList400px.args = { width: 400, groups: mockedGroups };

export const GroupsList800px = Template.bind({});
GroupsList800px.args = { width: 800, groups: mockedGroups };
