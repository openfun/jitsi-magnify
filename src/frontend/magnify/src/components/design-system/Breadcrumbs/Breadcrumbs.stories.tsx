import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';

export default {
  title: 'DesignSystem/Breadcrumbs',
  component: Breadcrumbs,
  parameters: {
    reactRouter: {
      routePath: '/app/test',
    },
  },
} as ComponentMeta<typeof Breadcrumbs>;

const Template: ComponentStory<typeof Breadcrumbs> = () => {
  return (
    <RouterProvider
      router={createBrowserRouter([
        {
          path: '*',
          handle: {
            crumb: () => {
              return 'Home';
            },
          },
          element: <Breadcrumbs />,
        },
      ])}
    />
  );
};

export const basicBreadcrumbs = Template.bind({});
