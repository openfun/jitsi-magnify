import { ProfileAccountView } from '@jitsi-magnify/core';
import { defineMessages, IntlShape } from 'react-intl';
import { RouteObject } from 'react-router-dom';

export enum AccountPath {
  ACCOUNT = '/app/account',
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
    element: <ProfileAccountView />,
    handle: {
      crumb: () => {
        return intl.formatMessage(roomRouteLabels[AccountPath.ACCOUNT]);
      },
    },
  };
};
