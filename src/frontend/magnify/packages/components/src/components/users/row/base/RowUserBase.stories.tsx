import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import createRandomUser from '../../../../factories/users';

import { UserRowBase } from '.';

export default {
  title: 'Users/Row/Base',
  component: UserRowBase,
} as Meta<typeof UserRowBase>;

const Template: StoryFn<typeof UserRowBase> = (args) => {
  return (
    <>
      <UserRowBase showSelect={true} user={createRandomUser()} />
    </>
  );
};

export const basic = {
  render: Template,
};
