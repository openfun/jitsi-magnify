import { Meta } from '@storybook/react';
import React from 'react';
import { MagnifyCard } from './MagnifyCard';

export default {
  title: 'DesignSystem/Card',
  component: MagnifyCard,
} as Meta<typeof MagnifyCard>;

export const basicCard = {
  args: {
    title: 'Test Card',
    children: <div>Hello 👋</div>,
  },
};
