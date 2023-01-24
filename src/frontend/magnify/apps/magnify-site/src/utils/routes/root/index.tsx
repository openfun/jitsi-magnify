import { SimpleLayout } from '@openfun/magnify-components';
import React from 'react';
import { defineMessages, IntlShape } from 'react-intl';
import { Navigate, Outlet, RouteObject } from 'react-router-dom';
import { RoomsPath } from '../rooms';

export enum RootPath {
  ROOT = '/app',
  HOME = '/',
}

const rootRouteLabels = defineMessages({
  [RootPath.ROOT]: {
    defaultMessage: 'Home',
    description: 'Label of the home view.',
    id: 'utils.routes.root.root.label',
  },
});

export const getRootRoute = (intl: IntlShape, children: RouteObject[]): RouteObject => {
  return {
    path: RootPath.ROOT,
    element: (
      <SimpleLayout urlLogo={'/assets/logo-fun-mooc.svg'}>
        <Outlet />
      </SimpleLayout>
    ),
    children: [
      ...children,
      {
        index: true,
        element: <Navigate to={RoomsPath.ROOMS} />,
      },
    ],
  };
};
