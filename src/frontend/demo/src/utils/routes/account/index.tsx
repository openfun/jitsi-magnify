import { defineMessages, IntlShape } from 'react-intl';
import { RouteObject } from 'react-router-dom';
import ProfileView from '../../../views/profile';

export enum AccountPath {
  ACCOUNT = '/account',
}

const roomRouteLabels = defineMessages({
  [AccountPath.ACCOUNT]: {
    defaultMessage: 'My account',
    description: 'Label of the account view.',
    id: 'utils.routes.account.account.label',
  },
});

export const getAccountRoutes = (intl: IntlShape): RouteObject => {
  return {
    path: AccountPath.ACCOUNT,
    element: <ProfileView />,
    handle: {
      crumb: () => {
        return intl.formatMessage(roomRouteLabels[AccountPath.ACCOUNT]);
      },
    },
  };
};
