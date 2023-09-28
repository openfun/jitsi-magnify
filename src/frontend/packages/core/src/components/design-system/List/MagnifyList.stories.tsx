import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { User } from '../../../types';
import { createRandomUsers } from '../../../factories/users';
import MagnifyList, { RowPropsExtended } from './MagnifyList';

export default {
  title: 'DesignSystem/MagnifyList',
  component: MagnifyList,
} as Meta<typeof MagnifyList>;

const UserRow = ({ item, onToggle }: RowPropsExtended<User>) => (
  <div onClick={onToggle} role="presentation">
    {item.name}
  </div>
);

const Template: StoryFn<typeof MagnifyList> = () => {
  return <MagnifyList rows={createRandomUsers()} Row={UserRow} />;
};

export const basic = {
  render: Template,
};
