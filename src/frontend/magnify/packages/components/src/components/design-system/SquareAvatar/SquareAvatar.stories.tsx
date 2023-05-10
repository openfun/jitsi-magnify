import { StoryFn } from '@storybook/react';
import React from 'react';
import { defaultUser } from '../../../mocks/allHandlers/login/loginHandlers';
import { SquareAvatar } from './SquareAvatar';

export default {
  title: 'DesignSystem/SquareAvatar',
  component: SquareAvatar,
};

const fakeUser = defaultUser;

export const Simple = {
  args: {
    src: '',
    title: fakeUser.name,
  },
};

export const WithMore = {
  args: {
    more: true,
    title: 'There is more',
  },
};

export const Empty = () => (
  <div>
    This is an empty avatar. It can be used to occupy the same space as a SquareAvatar with an
    actual image:
    <div style={{ border: 'solid 1px #000', width: 'fit-content' }}>
      <SquareAvatar />
    </div>
  </div>
);

export const Fallback = {
  args: {
    title: fakeUser.name,
    src: '',
  },
};
