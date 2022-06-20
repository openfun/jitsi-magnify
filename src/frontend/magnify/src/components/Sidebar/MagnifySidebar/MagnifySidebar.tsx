import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Box, Nav, Sidebar } from 'grommet';
import { SidebarButton, SidebarButtonProps } from '..';
import { User, Group, AppsRounded, Calendar, Services } from 'grommet-icons';

const SidebarHeader = () => <></>;

const SidebarFooter = () => <></>;

export interface MagnifySidebarProps {
  itemZones?: SidebarButtonProps[][];
  gap?: string;
  separatorGap?: string;
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

function MagnifySidebar({ itemZones, gap = 'small', separatorGap = 'large' }: MagnifySidebarProps) {
  const intl = useIntl();
  const zones = itemZones || [
    [{ label: intl.formatMessage(messages.sidebarMyAccountLabel), icon: <User />, to: 'account' }],
    [
      { label: intl.formatMessage(messages.sidebarRoomsLabel), icon: <AppsRounded />, to: 'rooms' },
      {
        label: intl.formatMessage(messages.sidebarMeetingsLabel),
        icon: <Calendar />,
        to: 'meetings',
      },
      { label: intl.formatMessage(messages.sidebarGroupsLabel), icon: <Group />, to: 'groups' },
      {
        label: intl.formatMessage(messages.sidebarSettingsLabel),
        icon: <Services />,
        to: 'settings',
      },
    ],
  ];
  return (
    <Sidebar
      responsive={false}
      background="light-1"
      header={<SidebarHeader />}
      footer={<SidebarFooter />}
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
