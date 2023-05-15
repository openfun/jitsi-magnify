import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { _users } from '../../../factories/users';
import MagnifyList from './MagnifyList';

export default {
  title: 'DesignSystem/MagnifyList',
  component: MagnifyList,
} as Meta<typeof MagnifyList>;

const Template: StoryFn<typeof MagnifyList> = (args) => {
  return (
    <MagnifyList
      rows={_users}
      Row={(props) => (
        <div onClick={() => props.onToggle()} role={'presentation'}>
          {props.item.name}
        </div>
      )}
    />
  );
};

export const basic = {
  render: Template,
};
