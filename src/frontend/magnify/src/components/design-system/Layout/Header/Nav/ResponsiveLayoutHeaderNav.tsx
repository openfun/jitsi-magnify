import { Box } from 'grommet';
import { AppsRounded, Calendar } from 'grommet-icons';
import * as React from 'react';
import { FunctionComponent } from 'react';
import { useRouting } from '../../../../../context/routing';
import { useIsSmallSize } from '../../../../../hooks/useIsMobile';
import {
  ResponsiveLayoutHeaderNavItem,
  ResponsiveLayoutHeaderNavItemProps,
} from './NavItem/ResponsiveLayoutHeaderNavItem';

interface ResponsiveLayoutHeaderNavProps {}

export const ResponsiveLayoutHeaderNav: FunctionComponent<ResponsiveLayoutHeaderNavProps> = ({
  ...props
}) => {
  const isSmall = useIsSmallSize();
  const routing = useRouting();

  const navItems: ResponsiveLayoutHeaderNavItemProps[] = [
    {
      icon: <AppsRounded aria-label={''} color={'plain'} size={'18px'} />,
      label: 'Rooms',
      goToRoute: routing.goToRoomsList,
    },
    {
      icon: <Calendar aria-label={''} color={'plain'} size={'18px'} />,
      label: 'Meetings',
      goToRoute: routing.goToMeetingList,
    },
  ];

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
        return <ResponsiveLayoutHeaderNavItem key={item.label} {...item} />;
      })}
    </Box>
  );
};
