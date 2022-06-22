import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Box, Nav, Sidebar } from 'grommet';
import { SidebarButton, SidebarButtonProps } from '..';
import { AvatarSVG, CalEventSVG, GridSVG, GroupSVG, SettingsSVG } from '../../design-system';

export interface MagnifySidebarProps {
  itemZones?: SidebarButtonProps[][];
  gap?: string;
  separatorGap?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const messages = defineMessages({
  sidebarMyAccountLabel: {
    defaultMessage: `My Account`,
    description: 'Page name on the sidebar button',
    id: 'components.sidebar.MagnifySidebar.sidebarMyAccountLabel',
  },
  sidebarRoomsLabel: {
    defaultMessage: `Rooms`,
    description: 'Page name on the sidebar button',
    id: 'components.sidebar.MagnifySidebar.sidebarRoomsLabel',
  },
  sidebarMeetingsLabel: {
    defaultMessage: `My Meetings`,
    description: 'Page name on the sidebar button',
    id: 'components.sidebar.MagnifySidebar.sidebarMeetingsLabel',
  },
  sidebarGroupsLabel: {
    defaultMessage: `Groups`,
    description: 'Page name on the sidebar button',
    id: 'components.sidebar.MagnifySidebar.sidebarGroupsLabel',
  },
  sidebarSettingsLabel: {
    defaultMessage: `Settings`,
    description: 'Page name on the sidebar button',
    id: 'components.sidebar.MagnifySidebar.sidebarSettingsLabel',
  },
});

function MagnifySidebar({
  itemZones,
  gap = 'small',
  separatorGap = 'large',
  header = <></>,
  footer = <></>,
}: MagnifySidebarProps) {
  const intl = useIntl();
  const zones = itemZones || [
    [
      {
        label: intl.formatMessage(messages.sidebarMyAccountLabel),
        icon: <AvatarSVG />,
        to: 'account',
      },
    ],
    [
      { label: intl.formatMessage(messages.sidebarRoomsLabel), icon: <GridSVG />, to: 'rooms' },
      {
        label: intl.formatMessage(messages.sidebarMeetingsLabel),
        icon: <CalEventSVG />,
        to: 'meetings',
      },
      { label: intl.formatMessage(messages.sidebarGroupsLabel), icon: <GroupSVG />, to: 'groups' },
      {
        label: intl.formatMessage(messages.sidebarSettingsLabel),
        icon: <SettingsSVG />,
        to: 'settings',
      },
    ],
  ];

  return (
    <Sidebar
      responsive={false}
      background="light-1"
      header={header}
      footer={footer}
      pad={{ left: 'medium', right: 'large', vertical: 'medium' }}
    >
      <Nav gap={separatorGap} responsive={false}>
        {zones.map((zone) => (
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
