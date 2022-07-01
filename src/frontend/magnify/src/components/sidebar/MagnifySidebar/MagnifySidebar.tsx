import { Box, Nav, Sidebar } from 'grommet';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import SidebarButton, { SidebarButtonProps } from '../SidebarButton';
import { AvatarSVG, CalEventSVG, GridSVG, GroupSVG, SettingsSVG } from '../../design-system';
import { MarginType } from 'grommet/utils';

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
      {
        label: intl.formatMessage(messages.sidebarSettingsLabel),
        icon: <SettingsSVG />,
        navigateTo: '/settings',
      },
    ],
  ];

  return (
    <Sidebar
      responsive={false}
      background="white"
      pad={{ left: 'medium', right: 'medium', vertical: 'medium' }}
      elevation="small"
      round="xsmall"
      header={header}
      footer={footer}
      width="400px"
      margin={margin}
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
