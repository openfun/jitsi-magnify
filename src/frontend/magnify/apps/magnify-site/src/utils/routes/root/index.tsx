import { RequireUser, ResponsiveLayout } from '@openfun/magnify-components';

import { defineMessages, IntlShape } from 'react-intl';
import { Link, Outlet, RouteObject } from 'react-router-dom';

export enum RootPath {
  ROOT = '/app',
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
    handle: {
      crumb: () => {
        return <Link to={RootPath.ROOT}>{intl.formatMessage(rootRouteLabels[RootPath.ROOT])}</Link>;
      },
    },
    element: (
      <ResponsiveLayout logoSrc={'/logo-fun-mooc.png'}>
        <RequireUser>
          <Outlet />
        </RequireUser>
      </ResponsiveLayout>
    ),
    children,
  };
};