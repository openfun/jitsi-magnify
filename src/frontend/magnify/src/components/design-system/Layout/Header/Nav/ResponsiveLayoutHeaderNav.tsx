import { Box } from 'grommet';
import { AppsRounded } from 'grommet-icons';
import * as React from 'react';
import { FunctionComponent } from 'react';
import { useIsSmallSize } from '../../../../../hooks/useIsMobile';
import {
  ResponsiveLayoutHeaderNavItem,
  ResponsiveLayoutHeaderNavItemProps,
} from './NavItem/ResponsiveLayoutHeaderNavItem';

interface ResponsiveLayoutHeaderNavProps {}

export const navItems: ResponsiveLayoutHeaderNavItemProps[] = [
  {
    icon: <AppsRounded aria-label={''} color={'plain'} size={'18px'} />,
    route: '/rooms',
    label: 'Rooms',
  },
];

export const ResponsiveLayoutHeaderNav: FunctionComponent<ResponsiveLayoutHeaderNavProps> = ({
  ...props
}) => {
  const isSmall = useIsSmallSize();

  return (
    <Box
      align="center"
      background={'rgb(244, 246, 248)'}
      direction="row"
      justify={'center'}
      pad={isSmall ? '5px 10px' : '7px 20px'}
      round={'small'}
    >
      {navItems.map((item) => {
        return <ResponsiveLayoutHeaderNavItem key={item.route} {...item} />;
      })}
    </Box>
  );
};
