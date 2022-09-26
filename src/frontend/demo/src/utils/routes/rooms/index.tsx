import { defineMessages, IntlShape } from 'react-intl';
import { Link, RouteObject } from 'react-router-dom';
import MyMeetings from '../../../views/myMeetings';
import RoomSettingsView from '../../../views/roomSettings';

export enum RoomsPath {
  ROOMS = '/rooms',
  ROOMS_SETTINGS = ':slug/settings',
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
      { element: <MyMeetings />, index: true },
      {
        element: <RoomSettingsView />,
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
