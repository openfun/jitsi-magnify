import { Box, Text } from 'grommet';
import * as React from 'react';
import { FunctionComponent } from 'react';
import { Link, useLocation } from 'react-router-dom';

export interface ResponsiveLayoutHeaderNavItemProps {
  icon: React.ReactNode;
  label: string;
  route: string;
}

export const ResponsiveLayoutHeaderNavItem: FunctionComponent<
  ResponsiveLayoutHeaderNavItemProps
> = ({ ...props }) => {
  const location = useLocation();
  const isCurrentRoute = location.pathname === props.route;

  return (
    <Link style={{ textDecoration: 'none' }} to={props.route}>
      <Box
        align={'center'}
        background={isCurrentRoute ? 'white' : undefined}
        direction={'row'}
        gap={'xsmall'}
        justify={'center'}
        pad={'6px'}
        round={'xsmall'}
      >
        {props.icon}
        <Text
          aria-label={props.label}
          color={'black'}
          size={'small'}
          weight={isCurrentRoute ? 'bold' : 'normal'}
        >
          {props.label}
        </Text>
      </Box>
    </Link>
  );
};
