import { Meta } from '@storybook/react';
import React from 'react';
import { IdentityBlock } from './IdentityBlock';

export default {
  title: 'profile/IdentityBlock',
  component: IdentityBlock,
} as Meta<typeof IdentityBlock>;

export const Simple = {
  args: {
    margin: { vertical: 'small', horizontal: 'small' },
  },
};
