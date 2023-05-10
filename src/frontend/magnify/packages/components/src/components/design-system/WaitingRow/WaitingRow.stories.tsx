import { StoryFn, Meta } from '@storybook/react';
import React from 'react';
import { WaitingRow } from './WaitingRow';

export default {
  title: 'DesignSystem/WaitingRow',
  component: WaitingRow,
} as Meta<typeof WaitingRow>;

export const basicWaitingRow = {
  args: {},
};
