import { Box, Nav, Sidebar } from 'grommet';
import React from 'react';
import { SidebarButton, SidebarButtonProps } from '..';
import { User, Group, AppsRounded, Calendar, Services } from 'grommet-icons';

export interface MagnifySidebarProps {
  itemZones?: SidebarButtonProps[][];
  gap?: string;
  separatorGap?: string;
}

function MagnifySidebar({ itemZones, gap = 'small', separatorGap = 'large' }: MagnifySidebarProps) {
  const zones = itemZones || [
    [{ label: 'My Account', icon: <User />, navigateTo: 'account' }],
    [
      { label: 'Rooms', icon: <AppsRounded />, navigateTo: 'rooms' },
      { label: 'My Meetings', icon: <Calendar />, navigateTo: 'meetings' },
      { label: 'Groups', icon: <Group />, navigateTo: 'groups' },
      { label: 'Settings', icon: <Services />, navigateTo: 'settings' },
    ],
  ];

  return (
    <Sidebar
      responsive={false}
      background="white"
      pad={{ left: 'medium', right: 'medium', vertical: 'medium' }}
      elevation="medium"
    >
      <Nav gap={separatorGap} responsive={false}>
        {zones.map((zone) => (
          <Box gap={gap} key={zone.map((i) => i.navigateTo).join('')}>
            {zone.map(({ label, navigateTo: to, disabled, icon, margin }) => (
              <SidebarButton
                label={label}
                navigateTo={to}
                disabled={disabled}
                icon={icon}
                margin={margin}
                key={to}
              />
            ))}
          </Box>
        ))}
      </Nav>
    </Sidebar>
  );
}

export default MagnifySidebar;
