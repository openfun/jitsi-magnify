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

function MagnifySidebar({
  itemZones = [
    [{ label: 'My Account', icon: <User />, to: 'account' }],
    [
      { label: 'Rooms', icon: <AppsRounded />, to: 'rooms' },
      { label: 'My Meetings', icon: <Calendar />, to: 'meetings' },
      { label: 'Groups', icon: <Group />, to: 'groups' },
      { label: 'Settings', icon: <Services />, to: 'settings' },
    ],
  ],
  gap = 'small',
  separatorGap = 'large',
}: MagnifySidebarProps) {
  return (
    <Sidebar
      responsive={false}
      background="light-1"
      header={<SidebarHeader />}
      footer={<SidebarFooter />}
      pad={{ left: 'medium', right: 'large', vertical: 'medium' }}
    >
      <Nav gap={separatorGap} responsive={false}>
        {itemZones.map((zone) => (
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
