import { Box, Card, Grid, Text } from 'grommet';
import { Projects, FastForward, Play } from 'grommet-icons';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useController } from '../../../controller';
import { Meeting } from '../../../types/meeting';
import { computeEnd } from './computeEnd';
import { getNextMeeting } from './getNextMeeting';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { LoadingButton } from '../../design-system';

export interface MeetingRowProps {
  /**
   * The meeting to display
   */
  meeting: Meeting;
  /**
   * The redirection url to use when the user clicks on join
   * (without the token nor the meeting id)
   */
  baseJitsiUrl: string;
}

const messages = defineMessages({
  fromDateToDate: {
    id: 'components.meetings.MeetingRow.fromDateToDate',
    description: 'Meeting row, description of repetition from <start date> to <end date>',
    defaultMessage: 'from {fromDate,date} to {toDate,date}',
  },
  joinLabel: {
    id: 'components.meetings.MeetingRow.joinLabel',
    description: 'Meeting row, label for join button',
    defaultMessage: 'Join',
  },
  endedLabel: {
    id: 'components.meetings.MeetingRow.endedLabel',
    description: 'Meeting row, label for ended meeting',
    defaultMessage: 'Ended',
  },
  monday: { id: 'components.meetings.MeetingRow.monday', defaultMessage: 'M' },
  tuesday: { id: 'components.meetings.MeetingRow.tuesday', defaultMessage: 'T' },
  wednesday: { id: 'components.meetings.MeetingRow.wednesday', defaultMessage: 'W' },
  thursday: { id: 'components.meetings.MeetingRow.thursday', defaultMessage: 'T' },
  friday: { id: 'components.meetings.MeetingRow.friday', defaultMessage: 'F' },
  saturday: { id: 'components.meetings.MeetingRow.saturday', defaultMessage: 'S' },
  sunday: { id: 'components.meetings.MeetingRow.sunday', defaultMessage: 'S' },
});

const weekDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export default function MeetingRow({ meeting, baseJitsiUrl }: MeetingRowProps) {
  // Hooks
  const intl = useIntl();
  const controller = useController();
  const navigate = useNavigate();
  const { mutate, isLoading } = useMutation(controller.joinMeeting, {
    onSuccess: ({ token }) => {
      navigate(`${baseJitsiUrl}/${meeting.id}?token=${token}`);
    },
  });

  // Convert the keys held_on_... to an array indexed by day number
  const holdOn = weekDays.map(
    (day): boolean => meeting[`held_on_${day}` as keyof Meeting] as boolean,
  );

  // Analyse the meeting and compute the nex ocurrence, if any
  const isRepeat = meeting.start !== meeting.end;
  const endTime = computeEnd(meeting.start_time, meeting.expected_duration);
  const { nextMeeting, inProgress, maybeInProgress } = getNextMeeting(
    meeting.start,
    meeting.end,
    holdOn,
    meeting.start_time,
    meeting.expected_duration,
    { margin: 30 },
  );
  const isOver = nextMeeting === null;

  // Render the row
  return (
    <Card
      background={inProgress ? 'light-3' : 'light-2'}
      pad="small"
      style={{ opacity: isOver ? 0.5 : 1 }}
      aria-disabled={isOver}
    >
      <Grid
        columns={['xxsmall', 'small', 'xsmall', 'xsmall', 'small', 'flex', 'auto']}
        gap="large"
        rows={['auto']}
        areas={[
          { name: 'icon', start: [0, 0], end: [0, 0] },
          { name: 'date', start: [1, 0], end: [1, 0] },
          { name: 'startTime', start: [2, 0], end: [2, 0] },
          { name: 'endTime', start: [3, 0], end: [3, 0] },
          { name: 'heldOn', start: [4, 0], end: [4, 0] },
          { name: 'title', start: [5, 0], end: [5, 0] },
          { name: 'actions', start: [6, 0], end: [6, 0] },
        ]}
        fill
      >
        <Box gridArea="icon" margin="auto 0px">
          <Projects color="brand" />
        </Box>

        <Box gridArea="date" direction="row" margin="auto 0px">
          {nextMeeting ? (
            <>
              <Box margin="auto 0px">
                <FastForward color="brand" size="16px" />
              </Box>
              <Text color="brand" margin={{ left: '5px' }}>
                {intl.formatDate(nextMeeting!)}
              </Text>
            </>
          ) : (
            <>
              <Text color="brand" margin={{ left: '5px' }}>
                {intl.formatMessage(messages.endedLabel)}
              </Text>
            </>
          )}
        </Box>

        <Box gridArea="startTime" margin="auto 0px">
          <Text color="brand">{meeting.start_time}</Text>
        </Box>

        <Box gridArea="endTime" margin="auto 0px">
          <Text color="brand">{endTime}</Text>
        </Box>

        <Box gridArea="heldOn" margin="auto 0px">
          {isRepeat && (
            <>
              <Text color="brand">
                {intl.formatMessage(messages.fromDateToDate, {
                  fromDate: new Date(meeting.start),
                  toDate: new Date(meeting.end),
                })}
              </Text>
              <Box flex direction="row">
                {weekDays.map((day, index) => (
                  <Box key={day} pad="3px">
                    <Text
                      color={holdOn[index] ? 'brand' : 'default'}
                      weight={holdOn[index] ? 'bold' : 'normal'}
                      size="small"
                    >
                      {intl.formatMessage(messages[day as keyof typeof messages])}
                    </Text>
                  </Box>
                ))}
              </Box>
            </>
          )}
        </Box>

        <Box gridArea="title" margin="auto 0px" direction="row">
          <Box margin="auto 10px">{inProgress ? <Play size="16px" color="status-ok" /> : ''}</Box>
          <Text weight="bold" color="brand">
            {meeting.name}
          </Text>
        </Box>

        <Box gridArea="actions" margin="auto 0px">
          <LoadingButton
            label={intl.formatMessage(messages.joinLabel)}
            primary
            disabled={!maybeInProgress}
            isLoading={isLoading}
            onClick={() => mutate(meeting.id)}
          />
        </Box>
      </Grid>
    </Card>
  );
}
