import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { DeleteAccountBlock } from './DeleteAccountBlock';

export default {
  title: 'profile/DeleteAccountBlock',
  component: DeleteAccountBlock,
} as Meta<typeof DeleteAccountBlock>;

const Template: StoryFn<typeof DeleteAccountBlock> = () => <DeleteAccountBlock />;

export const Simple = {
  render: Template,
  args: {},
};
