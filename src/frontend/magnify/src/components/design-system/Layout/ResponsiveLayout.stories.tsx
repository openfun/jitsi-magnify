import { ComponentMeta, ComponentStory } from '@storybook/react';

import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MyRooms, RegisterRoom } from '../../rooms';
import { MagnifyPageContent } from '../index';
import ResponsiveLayout from './ResponsiveLayout';

export default {
  title: 'Layout/ResponsiveLayout',
  component: ResponsiveLayout,
} as ComponentMeta<typeof ResponsiveLayout>;

const Template: ComponentStory<typeof ResponsiveLayout> = (args) => {
  return (
    <RouterProvider
      router={createBrowserRouter([
        {
          path: '*',
          element: (
            <ResponsiveLayout {...args}>
              <MagnifyPageContent actions={<RegisterRoom />} title={'Page title'}>
                <MyRooms baseJitsiUrl="*" />
              </MagnifyPageContent>
            </ResponsiveLayout>
          ),
        },
      ])}
    />
  );
};

export const appLayout = Template.bind({});
