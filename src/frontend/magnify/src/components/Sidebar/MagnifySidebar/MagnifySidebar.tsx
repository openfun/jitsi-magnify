import React from 'react';
import { Box, Nav, Text, Sidebar } from 'grommet';
import { SidebarButton, SidebarButtonProps } from '..';
import { User, Group, AppsRounded, Calendar, Services } from 'grommet-icons';

const SidebarHeader = () => <></>;

const SidebarFooter = () => <></>;

export interface MagnifySidebarProps {
  itemZones?: SidebarButtonProps[][];
  gap?: string;
  separatorGap?: string;
}

function MagnifySidebar({ itemZones, gap = 'small', separatorGap = 'large' }: MagnifySidebarProps) {
  return (
    <Sidebar
      responsive={false}
      background="light-1"
      header={<SidebarHeader />}
      footer={<SidebarFooter />}
      pad={{ left: 'medium', right: 'large', vertical: 'medium' }}
    >
      <Nav gap={separatorGap} responsive={false}>
        {itemZones?.map((zone) => (
          <Box gap={gap}>
            {zone.map((itemsProps) => (
              <SidebarButton {...itemsProps} />
            ))}
          </Box>
        ))}
      </Nav>
    </Sidebar>
  );
}

MagnifySidebar.args = {
  full: true,
};

export default MagnifySidebar;
