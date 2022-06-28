import { ComponentStory } from '@storybook/react';
import React from 'react';
import { createRandomGroupMember, createRandomGroupMembers } from '../../../factories/member';
import { RowsList } from '../../design-system';
import UserRow from './UserRow';

export default {
  title: 'users/UserRow',
  component: UserRow,
};

const Template: ComponentStory<typeof UserRow> = (args) => <UserRow {...args} />;

export const Simple = Template.bind({});
Simple.args = {
  user: createRandomGroupMember(),
};

export const Admin = Template.bind({});
Admin.args = {
  user: createRandomGroupMember(),
  isAdmin: true,
};

export const Selectable = Template.bind({});
Selectable.args = {
  user: createRandomGroupMember(),
  selected: true,
  onToggle: () => {},
};

/**
 * Example of how to use the UserRow component in a list
 */
const users = createRandomGroupMembers(8).map((user, index) => ({
  id: user.id,
  user,
  isAdmin: [3, 7].includes(index),
}));
const title = {
  id: 'components.users.userList.header',
  description: 'Header for the user list',
  defaultMessage: 'Users',
};
export const ListExample = () => (
  <RowsList
    label={title}
    rows={users}
    // Do not pass the onToggle prop, so it is not selectable
    Row={({ user, isAdmin }) => <UserRow user={user} isAdmin={isAdmin} />}
  />
);

export const SelectableListExample = () => <RowsList label={title} rows={users} Row={UserRow} />;
