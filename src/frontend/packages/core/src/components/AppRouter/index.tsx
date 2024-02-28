import * as React from 'react';
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouteObject,
  RouterProvider,
} from 'react-router-dom';
import { useTranslations } from '../../i18n';
import { getLiveKitRoutes } from '../../utils/routes/livekit';
import { getRoomsRoutes } from '../../utils/routes/rooms';
import { getRootRoute, RootPath } from '../../utils/routes/root';

import { getUsersRoutes } from '../../utils/routes/users';
import { RoomsListView } from '../../views/rooms/list';
import { DefaultProvider } from '../DefaultProvider';
import { SimpleLayout } from '../design-system';

export const AppRouter = () => {
  const intl = useTranslations();

  const routes: RouteObject[] = [
    {
      path: RootPath.HOME,
      element: (
        <DefaultProvider>
          <Outlet />
        </DefaultProvider>
      ),
      children: [
        {
          ...getRootRoute([
            { index: true, element: <Navigate to={RootPath.HOME} /> },
            { ...getRoomsRoutes(intl) },
            { ...getUsersRoutes() },
          ]),
        },

        { ...getLiveKitRoutes() },
        {
          index: true,
          element: (
            <SimpleLayout urlLogo="/assets/logo-fun-mooc.svg" >
              <RoomsListView />
            </SimpleLayout>
          ),
        },
        { path: '*', element: <Navigate to={RootPath.HOME} /> },
      ],
    },
  ];

  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
};
