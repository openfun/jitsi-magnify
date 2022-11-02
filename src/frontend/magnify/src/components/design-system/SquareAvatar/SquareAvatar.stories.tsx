import { ComponentStory } from '@storybook/react';
import React from 'react';
import { _users } from '../../../factories/users';
import { defaultUser } from '../../../mocks/allHandlers/login/loginHandlers';
import SquareAvatar from './SquareAvatar';

export default {
  title: 'DesignSystem/SquareAvatar',
  component: SquareAvatar,
};

const Template: ComponentStory<typeof SquareAvatar> = (args) => <SquareAvatar {...args} />;
console.log(_users);
const fakeUser = defaultUser;

export const Simple = Template.bind({});
Simple.args = {
  src: '',
  title: fakeUser.name,
};

export const WithMore = Template.bind({});
WithMore.args = {
  more: true,
  title: 'There is more',
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

export const Fallback = Template.bind({});
Fallback.args = {
  title: fakeUser.name,
  src: '',
};
