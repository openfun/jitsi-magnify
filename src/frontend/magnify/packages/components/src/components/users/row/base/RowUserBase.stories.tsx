import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import createRandomUser from '../../../../factories/users';

import { UserRowBase } from '.';

export default {
  title: 'Users/Row/Base',
  component: UserRowBase,
} as ComponentMeta<typeof UserRowBase>;

const Template: ComponentStory<typeof UserRowBase> = (args) => {
  return (
    <>
      <UserRowBase showSelect={true} user={createRandomUser()} />
    </>
  );
};

// create the template and stories
export const basic = Template.bind({});
