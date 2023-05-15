import { Box, Text } from 'grommet';
import * as React from 'react';
import { FunctionComponent } from 'react';

export interface ResponsiveLayoutHeaderNavItemProps {
  icon: React.ReactNode;
  label: string;
  goToRoute?: () => void;
}

export const ResponsiveLayoutHeaderNavItem: FunctionComponent<
  ResponsiveLayoutHeaderNavItemProps
> = ({ ...props }) => {
  return (
    <Box
      align={'center'}
      direction={'row'}
      gap={'xsmall'}
      justify={'center'}
      onClick={() => props.goToRoute?.()}
      pad={'6px'}
      round={'xsmall'}
    >
      {props.icon}
      <Text aria-label={props.label} color={'black'} size={'small'}>
        {props.label}
      </Text>
    </Box>
  );
};
