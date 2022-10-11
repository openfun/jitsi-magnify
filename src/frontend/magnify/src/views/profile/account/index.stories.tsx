import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ProfileAccountView } from './index';

export default {
  title: 'Views/Account/ProfileAccountView',
  component: ProfileAccountView,
} as ComponentMeta<typeof ProfileAccountView>;

const Template: ComponentStory<typeof ProfileAccountView> = (args) => {
  return (
    <RouterProvider
      router={createBrowserRouter([
        {
          path: '*',
          element: <ProfileAccountView />,
        },
      ])}
    />
  );
};

// create the template and stories
export const basic = Template.bind({});
