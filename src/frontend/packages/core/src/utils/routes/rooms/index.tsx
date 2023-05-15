import React from 'react';
import { defineMessages, IntlShape } from 'react-intl';
import { Link, Navigate, RouteObject } from 'react-router-dom';
import { RequireUser } from '../../../components';
import { RoomSettingsView } from '../../../views/rooms/settings';
import { RootPath } from '../root';

export enum RoomsPath {
  ROOMS = '/app/rooms',
  ROOMS_SETTINGS = '/app/rooms/:id/settings',
}

const roomRouteLabels = defineMessages({
  [RoomsPath.ROOMS]: {
    defaultMessage: 'Rooms',
    description: 'The label of the rooms view.',
    id: 'utils.routes.rooms.rooms.label',
  },
  [RoomsPath.ROOMS_SETTINGS]: {
    defaultMessage: 'Settings',
    description: 'The label of the rooms settings view.',
    id: 'utils.routes.rooms.roomsSettings.label',
  },
});

export const getRoomsRoutes = (intl: IntlShape): RouteObject => {
  return {
    path: RoomsPath.ROOMS,
    handle: {
      crumb: () => (
        <Link to={RootPath.HOME}>{intl.formatMessage(roomRouteLabels[RoomsPath.ROOMS])}</Link>
      ),
    },
    children: [
      { index: true, element: <Navigate to={RootPath.HOME} /> },
      {
        element: (
          <RequireUser>
            <RoomSettingsView />
          </RequireUser>
        ),
        path: RoomsPath.ROOMS_SETTINGS,
        handle: {
          crumb: () => {
            return intl.formatMessage(roomRouteLabels[RoomsPath.ROOMS_SETTINGS]);
          },
        },
      },
    ],
  };
};
