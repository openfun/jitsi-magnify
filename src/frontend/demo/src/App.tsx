import { AuthGard, ConnexionStatus, IntroductionLayout, useStore } from '@jitsi-magnify/core';
import { Box } from 'grommet';
import { useIntl } from 'react-intl';
import { createBrowserRouter, Navigate, RouteObject, RouterProvider } from 'react-router-dom';
import { getAccountRoutes } from './utils/routes/account';
import { getRoomsRoutes, RoomsPath } from './utils/routes/rooms';
import { getRootRoute } from './utils/routes/root';
import MyMeetings from './views/myMeetings';

export default function App() {
  const { connexionStatus } = useStore();
  const intl = useIntl();

  if (connexionStatus === ConnexionStatus.CONNECTING) return <AuthGard />;

  if (connexionStatus === ConnexionStatus.DISCONNECTED) {
    return (
      <Box overflow="hidden">
        <IntroductionLayout
          background="linear-gradient(45deg, #ffbdc9 0%, #687fc9 100%)"
          urlCover="/cover.svg"
          urlLogo="/logo-fun.svg"
        />
      </Box>
    );
  }

  let routes: RouteObject[] = [
    {
      ...getRootRoute(intl, [
        { index: true, element: <MyMeetings /> },
        { path: '/meetings', element: <Navigate to={RoomsPath.ROOMS} /> },
        { ...getAccountRoutes(intl) },
        { ...getRoomsRoutes(intl) },
      ]),
    },
  ];

  let router = createBrowserRouter(routes);
  return <RouterProvider router={router} />;
}
