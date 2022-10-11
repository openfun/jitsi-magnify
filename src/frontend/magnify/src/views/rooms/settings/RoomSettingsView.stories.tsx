import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RoomSettingsView } from './index';

export default {
  title: 'Views/Rooms/RoomSettingsView',
  component: RoomSettingsView,
} as ComponentMeta<typeof RoomSettingsView>;

const Template: ComponentStory<typeof RoomSettingsView> = (args) => {
  return (
    <RouterProvider
      router={createBrowserRouter([
        {
          path: '*',
          element: <RoomSettingsView {...args} />,
        },
      ])}
    />
  );
};

// create the template and stories
export const basic = Template.bind({});
