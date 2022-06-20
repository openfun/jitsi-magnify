import React from 'react';
import { Box } from 'grommet';
import { MagnifySidebar, SidebarButtonProps, MagnifySidebarProps } from '..';

function LayoutWithSidebar(props: { itemZones?: SidebarButtonProps[][]; children: any }) {
  return (
    <Box direction="row" height={{ min: '100%' }}>
      <MagnifySidebar itemZones={props.itemZones} />
      {props.children}
    </Box>
  );
}

export default LayoutWithSidebar;
