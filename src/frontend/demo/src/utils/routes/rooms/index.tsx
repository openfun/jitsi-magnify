import { defineMessages, IntlShape } from 'react-intl';
import { Link, RouteObject } from 'react-router-dom';
import { RoomsJitsiView } from '../../../views/rooms/jitsi';
import { RoomsListView } from '../../../views/rooms/list';
import { RoomSettingsView } from '../../../views/rooms/settings';

export enum RoomsPath {
  ROOMS = '/app/rooms',
  ROOMS_SETTINGS = '/app/rooms/:id/settings',
  ROOMS_JITSI = '/app/rooms/:id',
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
        <Link to={RoomsPath.ROOMS}>{intl.formatMessage(roomRouteLabels[RoomsPath.ROOMS])}</Link>
      ),
    },
    children: [
      { element: <RoomsListView />, index: true },
      {
        element: <RoomSettingsView />,
        path: RoomsPath.ROOMS_SETTINGS,
        handle: {
          crumb: () => {
            return intl.formatMessage(roomRouteLabels[RoomsPath.ROOMS_SETTINGS]);
          },
        },
      },
      {
        element: <RoomsJitsiView />,
        path: RoomsPath.ROOMS_JITSI,
      },
    ],
  };
};
