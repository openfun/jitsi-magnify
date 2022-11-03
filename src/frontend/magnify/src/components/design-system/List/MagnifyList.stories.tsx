import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { _users } from '../../../factories/users';
import { UserRow } from '../../users/row';
import MagnifyList from './index';

export default {
  title: 'DesignSystem/MagnifyList',
  component: MagnifyList,
} as ComponentMeta<typeof MagnifyList>;

const Template: ComponentStory<typeof MagnifyList> = (args) => {
  return (
    <MagnifyList
      {...args}
      Row={(props) => <UserRow {...props} user={props.item} />}
      rows={_users}
    />
  );
};

// create the template and stories
export const basic = Template.bind({});
