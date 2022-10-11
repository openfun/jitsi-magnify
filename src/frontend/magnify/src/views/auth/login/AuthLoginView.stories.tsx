import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthLoginView } from './index';

export default {
  title: 'Views/Auth/AuthLoginView',
  component: AuthLoginView,
} as ComponentMeta<typeof AuthLoginView>;

const Template: ComponentStory<typeof AuthLoginView> = (args) => {
  return (
    <RouterProvider
      router={createBrowserRouter([
        {
          path: '*',
          element: <AuthLoginView {...args} />,
        },
      ])}
    />
  );
};

// create the template and stories
export const basic = Template.bind({});
