import { defineMessages, IntlShape } from 'react-intl';
import { Link, RouteObject } from 'react-router-dom';
import { MeetingsListView } from '../../../views/meetings/list';
import { RoomsListView } from '../../../views/rooms/list';
import { RoomSettingsView } from '../../../views/rooms/settings';

export enum MeetingsPath {
  MEETINGS = '/app/meetings',
  MEETINGS_SETTINGS = '/app/meetings/:id/settings',
}

const meetingsRouteLabels = defineMessages({
  [MeetingsPath.MEETINGS]: {
    defaultMessage: 'Meeting',
    description: 'The label of the mettings view.',
    id: 'utils.routes.meetings.meetings.label',
  },
});

export const getMeetingsRoutes = (intl: IntlShape): RouteObject => {
  return {
    path: MeetingsPath.MEETINGS,
    handle: {
      crumb: () => (
        <Link to={MeetingsPath.MEETINGS}>
          {intl.formatMessage(meetingsRouteLabels[MeetingsPath.MEETINGS])}
        </Link>
      ),
    },
    children: [{ element: <MeetingsListView />, index: true }],
  };
};
