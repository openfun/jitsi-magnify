import { Meta, StoryFn } from '@storybook/react';

import React from 'react';

import { MyRooms, RegisterRoom } from '../../rooms';
import { MagnifyPageContent } from '../PageContent';
import { ResponsiveLayout } from './ResponsiveLayout';

export default {
  title: 'Layout/ResponsiveLayout',
  component: ResponsiveLayout,
} as Meta<typeof ResponsiveLayout>;

const Template: StoryFn<typeof ResponsiveLayout> = (args) => {
  return (
    <ResponsiveLayout {...args}>
      <MagnifyPageContent actions={<RegisterRoom />} title="Page title">
        <MyRooms baseJitsiUrl="*" />
      </MagnifyPageContent>
    </ResponsiveLayout>
  );
};

export const appLayout = {
  render: Template,
};
