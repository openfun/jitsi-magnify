import { render, screen } from '@testing-library/react';
import { Button } from 'grommet';
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MagnifyPageContent } from '../index';
import ResponsiveLayout from '../Layout';

describe('MagnifyPageContent', () => {
  const DefaultPage = () => {
    return (
      <RouterProvider
        router={createBrowserRouter([
          {
            path: '*',
            element: (
              <ResponsiveLayout>
                <MagnifyPageContent actions={<Button label={'add room'} />} title={'Rooms'}>
                  <div>Hello !</div>
                </MagnifyPageContent>
              </ResponsiveLayout>
            ),
          },
        ])}
      />
    );
  };
  it('shouldRender a MagnifyPageContent with title, children and actionButton', async () => {
    render(<DefaultPage />);
    screen.getByRole('button', { name: 'add room' });
    screen.getByRole('heading', { level: 3, name: 'Rooms' });
    screen.getByText('Hello !');
  });
});
