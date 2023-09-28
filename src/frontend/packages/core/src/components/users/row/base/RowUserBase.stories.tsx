import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import createRandomUser from '../../../../factories/users';

import { UserRowBase } from '.';

const Template: StoryFn<typeof UserRowBase> = () => {
  return <UserRowBase showSelect={true} user={createRandomUser()} />;
};

export const basic = {
  render: Template,
};

export default {
  title: 'Users/Row/Base',
  component: UserRowBase,
} as Meta<typeof UserRowBase>;
