import { useMemo, PropsWithChildren } from 'react';
import { createMemoryRouter, NavLink, RouterProvider } from 'react-router-dom';
import { MagnifyTestingProvider } from '../app';
import { ResponsiveLayout } from '../design-system';

export interface TestingContainerProps {
  router?: ReturnType<typeof createMemoryRouter>;
}

const CrumbElement = () => <NavLink to="/">Home</NavLink>;

export const TestingContainer = (props: PropsWithChildren<TestingContainerProps>) => {
  const router = useMemo(() => {
    if (props.router) {
      return props.router;
    }

    return createMemoryRouter(
      [
        {
          path: '/default',
          handle: {
            crumb: CrumbElement,
          },
          element: <ResponsiveLayout>{props.children}</ResponsiveLayout>,
        },
      ],
      { initialEntries: ['/default'], initialIndex: 1 },
    );
  }, [props.router, props.children]);

  return (
    <MagnifyTestingProvider>
      <RouterProvider router={router} />
    </MagnifyTestingProvider>
  );
};
