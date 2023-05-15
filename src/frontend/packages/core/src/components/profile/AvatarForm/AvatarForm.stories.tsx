import { Meta } from '@storybook/react';
import React from 'react';
import { AvatarForm } from './AvatarForm';

export default {
  title: 'profile/AvatarForm',
  component: AvatarForm,
} as Meta<typeof AvatarForm>;

export const Simple = {
  args: {
    id: '1',
    src: 'https://i.pravatar.cc/120?img=12',
  },
};

export const NoImage = {
  args: {},
};
