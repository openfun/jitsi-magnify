import * as React from 'react';
import { useIntl } from 'react-intl';
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouteObject,
  RouterProvider,
} from 'react-router-dom';
import { getAccountRoutes } from '../../utils/routes/account';
import { getAuthRoute } from '../../utils/routes/auth';
import { getJitsiRoutes } from '../../utils/routes/jitsi';
import { getMeetingsRoutes } from '../../utils/routes/meetings';
import { getRoomsRoutes, RoomsPath } from '../../utils/routes/rooms';
import { getRootRoute } from '../../utils/routes/root';
import { DefaultProvider } from '../DefaultProvider';

export const AppRouter = () => {
  const intl = useIntl();
  let routes: RouteObject[] = [
    {
      path: '/',
      element: (
        <DefaultProvider>
          <Outlet />
        </DefaultProvider>
      ),
      children: [
        {
          ...getRootRoute(intl, [
            { index: true, element: <Navigate to={RoomsPath.ROOMS} /> },
            { path: '/app/meetings', element: <Navigate to={RoomsPath.ROOMS} /> },
            { ...getAccountRoutes(intl) },
            { ...getRoomsRoutes(intl) },
            { ...getMeetingsRoutes(intl) },
          ]),
        },
        { ...getAuthRoute() },
        { ...getJitsiRoutes() },
        { index: true, element: <Navigate to={'/app'} /> },
        { path: '*', element: <Navigate to={'/app'} /> },
      ],
    },
  ];

  let router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
};
