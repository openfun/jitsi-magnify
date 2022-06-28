import { Box, Nav, Sidebar } from 'grommet';
import React from 'react';
import { SidebarButton, SidebarButtonProps } from '..';

export interface MagnifySidebarProps {
  itemZones?: SidebarButtonProps[][];
  gap?: string;
  separatorGap?: string;
}

function MagnifySidebar({ itemZones, gap = 'small', separatorGap = 'large' }: MagnifySidebarProps) {
  const zones = itemZones || [];

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
