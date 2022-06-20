import { Box, Nav, Sidebar } from 'grommet';
import { AppsRounded, Calendar, Group, Services, User } from 'grommet-icons';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { SidebarButton, SidebarButtonProps } from '..';

export interface MagnifySidebarProps {
  itemZones?: SidebarButtonProps[][];
  gap?: string;
  separatorGap?: string;
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

function MagnifySidebar({ itemZones, gap = 'small', separatorGap = 'large' }: MagnifySidebarProps) {
  const intl = useIntl();
  const zones = itemZones || [
    [
      {
        label: intl.formatMessage(messages.sidebarMyAccountLabel),
        icon: <User />,
        navigateTo: 'account',
      },
    ],
    [
      {
        label: intl.formatMessage(messages.sidebarRoomsLabel),
        icon: <AppsRounded />,
        navigateTo: 'rooms',
      },
      {
        label: intl.formatMessage(messages.sidebarMeetingsLabel),
        icon: <Calendar />,
        navigateTo: 'meetings',
      },
      {
        label: intl.formatMessage(messages.sidebarGroupsLabel),
        icon: <Group />,
        navigateTo: 'groups',
      },
      {
        label: intl.formatMessage(messages.sidebarSettingsLabel),
        icon: <Services />,
        navigateTo: 'settings',
      },
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
