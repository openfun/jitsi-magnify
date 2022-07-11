import { defineMessages, useIntl } from 'react-intl';
import React from 'react';
import { Box, Button, Heading, Layer, Text } from 'grommet';
import { WithToken } from '../../../types/withToken';
import { Meeting } from '../../../types/meeting';
import { Room } from '../../../types/room';
import MeetingRow from '../../meetings/MeetingRow/MeetingRow';

// An access to the Jitsi API can be for a room or a meeting.
export type PossibleIFrameAccess = { meeting: WithToken<Meeting> } | { room: WithToken<Room> };

export interface MeetingDisambiguationProps {
  roomSlug: string;
  possibilities: PossibleIFrameAccess[];
  setCurrent: (meeting: PossibleIFrameAccess) => void;
}

const messages = defineMessages({
  meetingDisambiguationTitle: {
    id: 'components.jitsi.MeetingDisambiguation.meetingDisambiguationTitle',
    defaultMessage: 'Meeting Disambiguation',
    description: 'The title of the meeting disambiguation modal',
  },
  meetingDisambiguationExplanation: {
    id: 'components.jitsi.MeetingDisambiguation.meetingDisambiguationExplanation',
    defaultMessage:
      'Welcome to the room {roomSlug}. Thre are several meetings in progress. Please select the meeting you want to join.',
  },
  joinRoomItSelf: {
    id: 'components.jitsi.MeetingDisambiguation.joinRoomItSelf',
    defaultMessage: 'Join the room itself',
    description: 'The label of the button to join the room',
  },
  meetings: {
    id: 'components.jitsi.MeetingDisambiguation.meetings',
    defaultMessage: 'Meetings',
    description: 'The label of the meetings section',
  },
});

const MeetingDisambiguation = ({
  roomSlug,
  possibilities,
  setCurrent,
}: MeetingDisambiguationProps) => {
  const intl = useIntl();
  const roomAvailable = possibilities.findIndex(
    (possibility) => !!possibility?.['room' as keyof PossibleIFrameAccess],
  );
  const meetingsAvailable = possibilities
    .filter((possibility) => !!possibility?.['meeting' as keyof PossibleIFrameAccess])
    .map(
      (possibility) => possibility?.['meeting' as keyof PossibleIFrameAccess] as WithToken<Meeting>,
    );

  return (
    <Layer>
      <Box pad="medium">
        <Heading level={3} color="brand">
          {intl.formatMessage(messages.meetingDisambiguationTitle)}
        </Heading>
        <Text color="brand">
          {intl.formatMessage(messages.meetingDisambiguationExplanation, { roomSlug })}
        </Text>

        {roomAvailable >= 0 && (
          <>
            <Heading level={4} size="small" color="brand">
              {roomSlug}
            </Heading>
            <Box direction="row" justify="center">
              <Button
                primary
                label={intl.formatMessage(messages.joinRoomItSelf)}
                onClick={() =>
                  setCurrent(possibilities[roomAvailable] as { room: WithToken<Room> })
                }
              />
            </Box>
          </>
        )}

        {meetingsAvailable.length > 0 && (
          <>
            <Heading level={4} size="small" color="brand">
              {intl.formatMessage(messages.meetings)}
            </Heading>
            {meetingsAvailable.map((meeting) => (
              <MeetingRow
                meeting={meeting as Meeting}
                onJoin={() => setCurrent({ meeting })}
                key={meeting.id}
              />
            ))}
          </>
        )}
      </Box>
    </Layer>
  );
};

export default MeetingDisambiguation;
