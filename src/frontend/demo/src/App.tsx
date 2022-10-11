import { useIntl } from 'react-intl';
import { createBrowserRouter, Navigate, RouteObject, RouterProvider } from 'react-router-dom';
import { getAccountRoutes } from './utils/routes/account';
import { getAuthRoute } from './utils/routes/auth';
import { getRoomsRoutes, RoomsPath } from './utils/routes/rooms';
import { getRootRoute } from './utils/routes/root';
import MyMeetings from './views/myMeetings';

export default function App() {
  const intl = useIntl();

  let routes: RouteObject[] = [
    {
      ...getRootRoute(intl, [
        { index: true, element: <MyMeetings /> },
        { path: '/meetings', element: <Navigate to={RoomsPath.ROOMS} /> },
        { ...getAccountRoutes(intl) },
        { ...getRoomsRoutes(intl) },
      ]),
    },
    { ...getAuthRoute() },
    { index: true, element: <Navigate to={'/'} /> },
    { path: '*', element: <Navigate to={'/'} /> },
  ];

  let router = createBrowserRouter(routes);
  return <RouterProvider router={router} />;
}
