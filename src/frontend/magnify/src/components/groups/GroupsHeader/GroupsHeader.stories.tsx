import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';
import GroupsHeader, { GroupsHeaderProps } from './GroupsHeader';

export default {
  title: 'Groups/GroupsHeader',
  component: GroupsHeader,
} as ComponentMeta<typeof GroupsHeader>;

// Template
const Template: ComponentStory<typeof GroupsHeader> = (args: GroupsHeaderProps) => (
  <>
    <pre>{JSON.stringify(args.groupsSelected, null, 2)}</pre>
    <GroupsHeader {...args} />
  </>
);

// Stories
export const Mixed = Template.bind({});
Mixed.args = {
  groupsSelected: {
    g1: true,
    g2: false,
    g3: false,
  },
  setGroupsSelected: (newGroupsSelected) => alert(JSON.stringify(newGroupsSelected, null, '  ')),
};

export const AllSelected = Template.bind({});
AllSelected.args = {
  groupsSelected: {
    g1: true,
    g2: true,
    g3: true,
  },
  setGroupsSelected: (newGroupsSelected) => alert(JSON.stringify(newGroupsSelected, null, '  ')),
};

export const NothingSelected = Template.bind({});
NothingSelected.args = {
  groupsSelected: {
    g1: false,
    g2: false,
    g3: false,
  },
  setGroupsSelected: (newGroupsSelected) => alert(JSON.stringify(newGroupsSelected, null, '  ')),
};
