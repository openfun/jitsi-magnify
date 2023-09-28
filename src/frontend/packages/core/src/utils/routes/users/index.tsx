import React from 'react';
import { Navigate, Outlet, RouteObject } from 'react-router-dom';
import { RequireUser } from '../../../components';
import { UserPreference } from '../../../views/users/preferences';

export enum UserPath {
  ROOT = '/app/users',
  PREFERENCES = '/app/users/preferences',
}

export const getUsersRoutes = (): RouteObject => {
  return {
    path: UserPath.ROOT,
    element: <Outlet />,
    children: [
      { element: <Navigate to={UserPath.PREFERENCES} />, index: true },
      {
        element: (
          <RequireUser>
            <UserPreference />
          </RequireUser>
        ),
        path: UserPath.PREFERENCES,
      },
    ],
  };
};
