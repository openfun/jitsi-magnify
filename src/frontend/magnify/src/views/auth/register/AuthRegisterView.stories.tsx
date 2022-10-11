import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthRegisterView } from './index';

export default {
  title: 'Views/Auth/AuthRegisterView',
  component: AuthRegisterView,
} as ComponentMeta<typeof AuthRegisterView>;

const Template: ComponentStory<typeof AuthRegisterView> = (args) => {
  return (
    <RouterProvider
      router={createBrowserRouter([
        {
          path: '*',
          element: <AuthRegisterView {...args} />,
        },
      ])}
    />
  );
};

// create the template and stories
export const basic = Template.bind({});
