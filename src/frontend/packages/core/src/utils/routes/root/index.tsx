import React from 'react';
import { Navigate, Outlet, RouteObject } from 'react-router-dom';
import { SimpleLayout } from '../../../components';
import { RoomsPath } from '../rooms';

export enum RootPath {
  ROOT = '/app',
  HOME = '/',
}

export const getRootRoute = (children: RouteObject[]): RouteObject => {
  return {
    path: RootPath.ROOT,
    element: (
      <SimpleLayout urlLogo="/assets/logo-fun-mooc.svg">
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
