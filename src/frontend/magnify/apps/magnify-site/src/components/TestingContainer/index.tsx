import { MagnifyTestingProvider, ResponsiveLayout } from '@openfun/magnify-components';
import { Router as RemixRouter } from '@remix-run/router/dist/router';
import * as React from 'react';
import { PropsWithChildren } from 'react';
import { createMemoryRouter, NavLink, RouterProvider } from 'react-router-dom';

export interface TestingContainerProps {
  router?: RemixRouter;
}

export const TestingContainer = ({ ...props }: PropsWithChildren<TestingContainerProps>) => {
  const getRouter = (): RemixRouter => {
    if (props.router) {
      return props.router;
    }

    return createMemoryRouter(
      [
        {
          path: '/default',
          handle: {
            crumb: () => {
              return <NavLink to={'/'}>Home</NavLink>;
            },
          },
          element: <ResponsiveLayout>{props.children}</ResponsiveLayout>,
        },
      ],
      { initialEntries: ['/default'], initialIndex: 1 },
    );
  };

  return (
    <MagnifyTestingProvider>
      <RouterProvider router={getRouter()} />
    </MagnifyTestingProvider>
  );
};
