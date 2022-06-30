import { Box } from 'grommet';
import React from 'react';

import { MagnifySidebar, SidebarButtonProps } from '..';

function LayoutWithSidebar(props: {
  itemZones?: SidebarButtonProps[][];
  children: React.ReactNode;
}) {
  return (
    <Box direction="row" height={{ min: '100%' }}>
      <MagnifySidebar itemZones={props.itemZones} />
      {props.children}
    </Box>
  );
}

export default LayoutWithSidebar;
