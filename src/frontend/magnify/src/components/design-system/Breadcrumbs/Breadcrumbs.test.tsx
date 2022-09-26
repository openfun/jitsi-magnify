import { render, screen } from '@testing-library/react';
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ResponsiveLayout from '../Layout';
import Breadcrumbs from './Breadcrumbs';

describe('Breadcrumbs', () => {
  it('should render successfully a breadcrumbs', async () => {
    render(
      <RouterProvider
        router={createBrowserRouter([
          {
            path: '*',
            handle: {
              crumb: () => {
                return 'Home';
              },
            },
            element: (
              <ResponsiveLayout>
                <Breadcrumbs />
              </ResponsiveLayout>
            ),
          },
        ])}
      />,
    );

    screen.getByRole('list');
    const items = screen.getAllByRole('listitem');
    expect(items.length).toBe(1);
    expect(items[0].textContent).toBe('Home');
  });
});
