import { JitsiMeeting as JitsiMeetingIframe } from '@jitsi/react-sdk';
import IJitsiMeetExternalApi from '@jitsi/react-sdk/lib/types/IJitsiMeetExternalApi';
import { Box, Button, Stack } from 'grommet';
import React, { useRef } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useQuery } from 'react-query';

import { useController } from '../../../controller';
import { Nullable } from '../../../types/misc';
import MeetingDisambiguation from '../MeetingDisambiguation';
import { PossibleIFrameAccess } from '../MeetingDisambiguation/MeetingDisambiguation';
import { JitsiMeetingExamplePanel } from './JitsiMeetingExamplePanel';

export interface JitsiMeetingProps {
  roomSlug?: string;
  meetingId?: string;
  jitsiDomain: string;
}

const messages = defineMessages({
  openMagnifyPanel: {
    id: 'components.jitsi.JitsiMeeting.openMagnifyPanel',
    defaultMessage: 'Open Magnify Panel',
    description: 'Button to open the Magnify panel',
  },
  closeMagnifyPanel: {
    id: 'components.jitsi.JitsiMeeting.closeMagnifyPanel',
    defaultMessage: 'Close Magnify Panel',
    description: 'Button to close the Magnify panel',
  },
});

const getMeetingSettings = (possibility: Nullable<PossibleIFrameAccess>, roomSlug: string) => {
  if (!possibility) return null;

  if ('meeting' in possibility) {
    return {
      roomName: possibility.meeting.jitsiRoomName,
      roomSubject: `Meeting ${possibility.meeting.name} in room ${roomSlug}`,
      jwt: possibility.meeting.token,
    };
  }
  return {
    roomName: possibility.room.jitsiRoomName,
    roomSubject: roomSlug,
    jwt: possibility.room.token,
  };
};

const JitsiMeeting = ({ roomSlug, meetingId, jitsiDomain }: JitsiMeetingProps) => {
  const intl = useIntl();

  // Jitsi refs
  const apiRef = useRef<IJitsiMeetExternalApi | null>(null);
  const iframeRef = useRef<HTMLDivElement | null>(null);

  // Current chosen jitsi access
  const [chosenConnexion, setChosenConnexion] =
    React.useState<Nullable<PossibleIFrameAccess>>(null);

  // Users
  const [users, setUsers] = React.useState<any[]>([]);
  const handleParticipantsChanged = () => {
    const participants = apiRef.current?.getParticipantsInfo();
    setUsers(participants || []);
  };

  // Controls
  const controller = useController();
  const key = meetingId || roomSlug || '';
  const { data } = useQuery(`join-meeting-${key}`, async () => {
    if (meetingId) {
      const meeting = await controller.getMeeting(meetingId);
      return [{ meeting }] as PossibleIFrameAccess[];
    }

    const room = await controller.getRoomBySlug(roomSlug || '');
    const possibleMeetings = await controller.getRoomPossibleMeetings(roomSlug || '');
    return [
      { room },
      ...possibleMeetings.map((meeting) => ({ meeting })),
    ] as PossibleIFrameAccess[];
  });

  const [openPanel, setOpenPanel] = React.useState(false);

  // Handle the Jitsi IFrame
  const handleApiReady = (apiObj: IJitsiMeetExternalApi) => {
    apiRef.current = apiObj;
    apiRef.current?.addListener('participantJoined', handleParticipantsChanged);
    apiRef.current?.addListener('participantLeft', handleParticipantsChanged);
    apiRef.current?.addListener('videoConferenceJoined', handleParticipantsChanged);
    apiRef.current?.addListener('videoConferenceLeft', handleParticipantsChanged);
    handleParticipantsChanged();
  };
  const handleIFrameLoaded = (iframe: HTMLDivElement) => {
    iframeRef.current = iframe;
    iframe.style.height = '100vh';
  };

  const current: Nullable<PossibleIFrameAccess> =
    data && data.length === 1 ? data[0] : chosenConnexion;
  const jitsiMeetingSettings = getMeetingSettings(current, roomSlug || '');
  const groups = current && 'room' in current ? current?.room?.groups : current?.meeting?.groups;

  // Render
  return (
    <Box direction="row">
      {openPanel && <JitsiMeetingExamplePanel groups={groups || []} users={users} />}
      <Box height="100vh" width="100vw">
        {!current && data && data.length > 1 && roomSlug && (
          <MeetingDisambiguation
            possibilities={data}
            roomSlug={roomSlug}
            setCurrent={setChosenConnexion}
          />
        )}
        {jitsiMeetingSettings && (
          <Stack anchor="bottom-left">
            <JitsiMeetingIframe
              domain={jitsiDomain}
              getIFrameRef={handleIFrameLoaded}
              jwt={jitsiMeetingSettings.jwt}
              onApiReady={handleApiReady}
              roomName={jitsiMeetingSettings.roomName}
              configOverwrite={{
                subject: jitsiMeetingSettings.roomSubject,
              }}
            />
            <Box margin="small">
              <Button
                primary
                color="#040404"
                onClick={() => setOpenPanel((pOpen) => !pOpen)}
                label={
                  openPanel
                    ? intl.formatMessage(messages.closeMagnifyPanel)
                    : intl.formatMessage(messages.openMagnifyPanel)
                }
              />
            </Box>
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default JitsiMeeting;
