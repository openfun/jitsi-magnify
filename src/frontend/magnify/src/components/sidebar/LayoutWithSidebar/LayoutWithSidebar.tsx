import { Box, Heading } from 'grommet';
import React from 'react';

import MagnifySidebar from '../MagnifySidebar';
import { SidebarButtonProps } from '../SidebarButton';
import UserMenu from '../../auth/UserMenu';
import styled from 'styled-components';

export interface LayoutWithSidebarProps {
  itemZones?: SidebarButtonProps[][];
  title?: string;
  children: React.ReactNode;
}

const Content = styled('div')`
  padding: ${(props) => props.theme.global.edgeSize.large};
  width: 100%;
  overflow-y: auto;
  height: 100%;
  box-sizing: border-box;
`;

function LayoutWithSidebar({ children, title, itemZones }: LayoutWithSidebarProps) {
  return (
    <Box direction="row" height={{ height: '100%', min: '100%' }}>
      <Box height="100%" pad="xsmall">
        <MagnifySidebar itemZones={itemZones} />
      </Box>

      <Content>
        <Box justify="end" direction="row">
          <UserMenu />
        </Box>
        {title && (
          <Heading level={1} color="brand" size="small">
            {title}
          </Heading>
        )}
        {children}
      </Content>
    </Box>
  );
}

export default LayoutWithSidebar;
