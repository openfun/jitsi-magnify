import { ComponentStory } from '@storybook/react';
import { Box } from 'grommet';
import React from 'react';
import filename from './example-cover.svg';
import IntroductionLayout from './IntroductionLayout';
import logo from './logo-fun.svg';

export default {
  title: 'auth/IntroductionLayout',
  component: IntroductionLayout,
};

const Template: ComponentStory<typeof IntroductionLayout> = (args) => (
  <Box height="100vh" width="100vw">
    <IntroductionLayout {...args} />
  </Box>
);

export const Simple = Template.bind({});
Simple.args = {
  urlCover: filename,
  urlLogo: logo,
  background: 'linear-gradient(45deg, #ffbdc9 0%, #687fc9 100%)',
};
