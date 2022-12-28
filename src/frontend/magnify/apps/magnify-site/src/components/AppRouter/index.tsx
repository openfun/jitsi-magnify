import { useTranslations } from '@openfun/magnify-components';
import * as React from 'react';
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouteObject,
  RouterProvider,
} from 'react-router-dom';
import { getJitsiRoutes } from '../../utils/routes/jitsi';
import { getRoomsRoutes, RoomsPath } from '../../utils/routes/rooms';
import { getRootRoute, RootPath } from '../../utils/routes/root';
import { DefaultProvider } from '../DefaultProvider';

export const AppRouter = () => {
  const intl = useTranslations();
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
            { ...getRoomsRoutes(intl) },
          ]),
        },
        { ...getJitsiRoutes() },
        { index: true, element: <Navigate to={RootPath.ROOT} /> },
        { path: '*', element: <Navigate to={RootPath.ROOT} /> },
      ],
    },
  ];

  let router = createBrowserRouter(routes);

  // return <div>{'DSDSDS'}</div>;
  return <RouterProvider router={router} />;
};
