import { Box, Button, Card } from 'grommet';
import React, { useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { useController } from '../../../controller';
import { RowsList, SettingsSVG } from '../../design-system';
import { GroupRow } from '../../groups';
import MeetingRow from '../../meetings/MeetingRow/MeetingRow';
import AddGroupToRoomDialog from '../AddGroupToRoomDialog';
import CreateMeetingInRoomDialog from '../CreateMeetingInRoomDialog';

const messages = defineMessages({
  meetingListTitle: {
    id: 'components.rooms.roomOverview.meetingListTitle',
    defaultMessage:
      '{numberOfRows, plural, =0 {No meetings} one {1 meeting} other {{numberOfRows} meetings}} in this room',
    description: 'Title for the list of meetings in a room',
  },
  groupsListTitle: {
    id: 'components.rooms.roomOverview.groupsListTitle',
    defaultMessage:
      '{numberOfRows, plural, =0 {No groups} one {1 group} other {{numberOfRows} groups}} in this room',
    description: 'Title for the list of groups in a room',
  },
  joinRoomLabel: {
    id: 'components.rooms.roomOverview.joinRoomLabel',
    defaultMessage: 'Join room',
    description: 'Label for the button to join a room',
  },
  configureRoomLabel: {
    id: 'components.rooms.roomOverview.configureRoomLabel',
    defaultMessage: 'Configure room',
    description: 'Label for the button to configure a room',
  },
  addGroupLabel: {
    id: 'components.rooms.roomOverview.addGroupLabel',
    defaultMessage: 'Add group',
    description: 'Label for the button to add a group to a room',
  },
  createMeetingLabel: {
    id: 'components.rooms.roomOverview.createMeetingLabel',
    defaultMessage: 'New meeting',
    description: 'Label for the button to create a meeting in a room',
  },
});

export interface RoomOverviewProps {
  /**
   * The slug of the room to load (also called "name" of the room)
   */
  roomSlug: string;
  /**
   * The path to where the user should be sent when clicking on a meeting
   * (the token will be added as query param at the end)
   */
  baseJitsiUrl: string;
}

const RoomOverview = ({ roomSlug, baseJitsiUrl }: RoomOverviewProps) => {
  const intl = useIntl();
  const controller = useController();
  const { data: room, isLoading } = useQuery(['room', roomSlug], () =>
    controller.getRoomBySlug(roomSlug),
  );

  const [addGroupOpen, setAddGroupOpen] = useState(false);
  const handleAddGroupOpen = () => {
    setAddGroupOpen(true);
  };
  const handleAddGroupClose = () => {
    setAddGroupOpen(false);
  };

  const [createMeetingOpen, setCreateMeetingOpen] = useState(false);
  const handleCreateMeetingOpen = () => {
    setCreateMeetingOpen(true);
  };
  const handleCreateMeetingClose = () => {
    setCreateMeetingOpen(false);
  };

  return (
    <>
      <Card background="white" direction="row" justify="end" pad="medium">
        <Button
          primary
          label={intl.formatMessage(messages.joinRoomLabel)}
          margin={{ right: 'small' }}
          as={({ children, type, className }) => (
            <Link type={type} className={className} to={`${baseJitsiUrl}/${roomSlug}`}>
              {children}
            </Link>
          )}
        />
        <Button
          primary
          label={intl.formatMessage(messages.configureRoomLabel)}
          icon={<SettingsSVG />}
          as={({ children, type, className }) => (
            <Link type={type} className={className} to={`/rooms/${roomSlug}/settings`}>
              {children}
            </Link>
          )}
        />
      </Card>
      <Box margin={{ top: 'medium' }}>
        <RowsList
          label={messages.meetingListTitle}
          rows={(room?.meetings || []).map((meeting) => ({ id: meeting.id, meeting }))}
          Row={({ meeting }) => <MeetingRow meeting={meeting} baseJitsiUrl={baseJitsiUrl} />}
          isLoading={isLoading}
          titleIsLoading={isLoading}
          addLabel={intl.formatMessage(messages.createMeetingLabel)}
          onAdd={handleCreateMeetingOpen}
        />
      </Box>
      <Box margin={{ top: 'medium' }}>
        <RowsList
          label={messages.groupsListTitle}
          rows={(room?.groups || []).map((group) => ({ id: group.id, group }))}
          isLoading={isLoading}
          titleIsLoading={isLoading}
          Row={GroupRow}
          addLabel={intl.formatMessage(messages.addGroupLabel)}
          onAdd={handleAddGroupOpen}
        />
      </Box>
      <CreateMeetingInRoomDialog
        open={createMeetingOpen}
        onClose={handleCreateMeetingClose}
        roomSlug={roomSlug}
      />
      <AddGroupToRoomDialog open={addGroupOpen} onClose={handleAddGroupClose} roomSlug={roomSlug} />
    </>
  );
};

export default RoomOverview;
