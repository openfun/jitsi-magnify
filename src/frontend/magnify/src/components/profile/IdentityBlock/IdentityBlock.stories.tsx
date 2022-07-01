import React from 'react';
import IdentityBlock from './IdentityBlock';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import InjectFakeUser from '../../../utils/InjectFakeUser';

export default {
  title: 'profile/IdentityBlock',
  component: IdentityBlock,
} as ComponentMeta<typeof IdentityBlock>;

const Template: ComponentStory<typeof IdentityBlock> = (args) => (
  <InjectFakeUser>
    <IdentityBlock {...args} />;
  </InjectFakeUser>
);

// create the template and 2 stories for variants blue and red
export const Simple = Template.bind({});
Simple.args = {};
