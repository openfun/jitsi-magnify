import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, Text } from 'grommet';

export default function DebugRoute() {
  const { pathname, search, hash } = useLocation();
  return (
    <Box margin={{ top: 'xlarge' }}>
      <Text size="medium">
        <b>Router Debug</b>
        <br />
      </Text>
      <Text size="small">
        Current path:{' '}
        <i>
          {pathname || '/'}
          {hash || ''}
          {search || ''}
        </i>
        <br />
      </Text>
      <Link to="/">Go back</Link>
    </Box>
  );
}
