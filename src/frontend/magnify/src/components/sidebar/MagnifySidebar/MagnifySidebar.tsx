import { Box, Nav, Sidebar } from 'grommet';
import { MarginType } from 'grommet/utils';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { AvatarSVG, CalEventSVG, GridSVG, GroupSVG } from '../../design-system';
import SidebarButton, { SidebarButtonProps } from '../SidebarButton';

export interface MagnifySidebarProps {
  itemZones?: SidebarButtonProps[][];
  gap?: string;
  separatorGap?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  margin?: MarginType;
}

const messages = defineMessages({
  sidebarMyAccountLabel: {
    defaultMessage: `My Account`,
    description: 'Sidebar button label for navigating to the user account page',
    id: 'components.sidebar.MagnifySidebar.sidebarMyAccountLabel',
  },
  sidebarRoomsLabel: {
    defaultMessage: `Rooms`,
    description: 'Sidebar button label for navigating to the rooms page',
    id: 'components.sidebar.MagnifySidebar.sidebarRoomsLabel',
  },
  sidebarMeetingsLabel: {
    defaultMessage: `My Meetings`,
    description: 'Sidebar button label for navigating to all meetings page',
    id: 'components.sidebar.MagnifySidebar.sidebarMeetingsLabel',
  },
  sidebarGroupsLabel: {
    defaultMessage: `Groups`,
    description: 'Sidebar button label for navigating to the list of groups page',
    id: 'components.sidebar.MagnifySidebar.sidebarGroupsLabel',
  },
  sidebarSettingsLabel: {
    defaultMessage: `Settings`,
    description: 'Sidebar button label for navigating to the settings page',
    id: 'components.sidebar.MagnifySidebar.sidebarSettingsLabel',
  },
});

function MagnifySidebar({
  itemZones,
  gap = 'small',
  separatorGap = 'large',
  header = <></>,
  footer = <></>,
  margin = 'none',
}: MagnifySidebarProps) {
  const intl = useIntl();
  const zones = itemZones || [
    [
      {
        label: intl.formatMessage(messages.sidebarMyAccountLabel),
        icon: <AvatarSVG />,
        navigateTo: '/account',
      },
    ],
    [
      {
        label: intl.formatMessage(messages.sidebarRoomsLabel),
        icon: <GridSVG />,
        navigateTo: '/rooms',
      },
      {
        label: intl.formatMessage(messages.sidebarMeetingsLabel),
        icon: <CalEventSVG />,
        navigateTo: '/meetings',
      },
      {
        label: intl.formatMessage(messages.sidebarGroupsLabel),
        icon: <GroupSVG />,
        navigateTo: '/groups',
      },
    ],
  ];

  return (
    <Sidebar
      background="white"
      elevation="small"
      footer={footer}
      header={header}
      margin={margin}
      pad={{ left: 'medium', right: 'medium', vertical: 'medium' }}
      responsive={false}
      round="xsmall"
      width="400px"
    >
      <Nav gap={separatorGap} responsive={false}>
        {zones.map((zone) => (
          <Box key={zone.map((i) => i.navigateTo).join('')} gap={gap}>
            {zone.map(({ label, navigateTo: to, disabled, icon, margin }) => (
              <SidebarButton
                key={to}
                disabled={disabled}
                icon={icon}
                label={label}
                margin={margin}
                navigateTo={to}
              />
            ))}
          </Box>
        ))}
      </Nav>
    </Sidebar>
  );
}

export default MagnifySidebar;
