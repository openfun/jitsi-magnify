import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { _users } from '../../../factories/users';
import MagnifyList from './MagnifyList';

export default {
  title: 'DesignSystem/MagnifyList',
  component: MagnifyList,
} as ComponentMeta<typeof MagnifyList>;

const Template: ComponentStory<typeof MagnifyList> = (args) => {
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

// create the template and stories
export const basic = Template.bind({});
