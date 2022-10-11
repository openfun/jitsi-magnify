import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RoomsListView } from './index';

export default {
  title: 'Views/Rooms/RoomsView',
  component: RoomsListView,
} as ComponentMeta<typeof RoomsListView>;

const Template: ComponentStory<typeof RoomsListView> = (args) => {
  return (
    <RouterProvider
      router={createBrowserRouter([
        {
          path: '*',
          element: <RoomsListView {...args} />,
        },
      ])}
    />
  );
};

// create the template and stories
export const basic = Template.bind({});
