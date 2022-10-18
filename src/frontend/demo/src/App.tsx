import { useIntl } from 'react-intl';
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouteObject,
  RouterProvider,
} from 'react-router-dom';

import { DefaultProvider } from './components/DefaultProvider';
import { getAccountRoutes } from './utils/routes/account';
import { getAuthRoute } from './utils/routes/auth';
import { getRoomsRoutes, RoomsPath } from './utils/routes/rooms';
import { getRootRoute } from './utils/routes/root';

export default function App() {
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
          ]),
        },
        { ...getAuthRoute() },
        { index: true, element: <Navigate to={'/app'} /> },
        { path: '*', element: <Navigate to={'/app'} /> },
      ],
    },
  ];

  let router = createBrowserRouter(routes);
  return <RouterProvider router={router} />;
}
