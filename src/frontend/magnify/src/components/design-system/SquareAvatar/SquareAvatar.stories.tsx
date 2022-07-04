import { ComponentStory } from '@storybook/react';
import React from 'react';
import { createRandomGroupMember } from '../../../factories/member';
import SquareAvatar from './SquareAvatar';

export default {
  title: 'DesignSystem/SquareAvatar',
  component: SquareAvatar,
};

const Template: ComponentStory<typeof SquareAvatar> = (args) => <SquareAvatar {...args} />;

const fakeUser = createRandomGroupMember();

export const Simple = Template.bind({});
Simple.args = {
  src: fakeUser.avatar,
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
