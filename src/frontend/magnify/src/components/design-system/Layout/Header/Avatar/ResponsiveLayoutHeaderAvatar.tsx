import { Avatar, Box, Text, Tip } from 'grommet';
import * as React from 'react';
import { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';

interface ResponsiveLayoutHeaderAvatarProps {}

export const ResponsiveLayoutHeaderAvatar: FunctionComponent<ResponsiveLayoutHeaderAvatarProps> = ({
  ...props
}) => {
  return (
    <Link style={{ textDecoration: 'none' }} to={'/account'}>
      <Tip content={'My account'}>
        <Box align={'center'} direction={'row'} justify={'center'}>
          <Avatar background={'light-3'} size={'40px'}>
            <Text style={{ textDecoration: 'none' }}>NP</Text>
          </Avatar>
        </Box>
      </Tip>
    </Link>
  );
};
