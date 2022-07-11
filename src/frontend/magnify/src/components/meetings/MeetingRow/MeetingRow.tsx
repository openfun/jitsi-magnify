import { Box, Button, Card, Grid, Text } from 'grommet';
import { Projects, Play } from 'grommet-icons';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Meeting } from '../../../types/meeting';
import { getNextMeeting } from './getNextMeeting';
import { Link, useNavigate } from 'react-router-dom';
import formatDuration from './formatDuration';

export interface MeetingRowProps {
  /**
   * The meeting to display
   */
  meeting: Meeting;
  /**
   * The redirection url to use when the user clicks on join
   * (without the token nor the meeting id)
   */
  baseJitsiUrl?: string;
  /**
   * What to do when the user clicks on join. If provided
   * it will override the default behavior of redirecting
   */
  onJoin?: (meeting: Meeting) => void;
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

export default function MeetingRow({ meeting, baseJitsiUrl, onJoin }: MeetingRowProps) {
  // Hooks
  const intl = useIntl();

  // Convert the keys held_on_... to an array indexed by day number
  const holdOn = weekDays.map(
    (day): boolean => meeting[`held_on_${day}` as keyof Meeting] as boolean,
  );

  // Analyse the meeting and compute the nex ocurrence, if any
  const isRepeat = meeting.start !== meeting.end;
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
      elevation="0"
      margin={{ bottom: 'small' }}
    >
      <Grid
        columns={['auto', 'xsmall', 'xsmall', 'small', 'flex', 'auto']}
        gap="medium"
        rows={['auto']}
        areas={[
          { name: 'icon', start: [0, 0], end: [0, 0] },
          { name: 'date', start: [1, 0], end: [1, 0] },
          { name: 'times', start: [2, 0], end: [2, 0] },
          { name: 'heldOn', start: [3, 0], end: [3, 0] },
          { name: 'title', start: [4, 0], end: [4, 0] },
          { name: 'actions', start: [5, 0], end: [5, 0] },
        ]}
        fill
      >
        <Box gridArea="icon" margin="auto 0px">
          <Projects color="brand" />
        </Box>

        <Box gridArea="date" direction="row" margin="auto 0px">
          {nextMeeting ? (
            <Text color="brand" margin={{ left: '5px' }}>
              {intl.formatDate(nextMeeting!)}
            </Text>
          ) : (
            <Text color="brand" margin={{ left: '5px' }}>
              {intl.formatMessage(messages.endedLabel)}
            </Text>
          )}
        </Box>

        <Box gridArea="times" margin="auto 0px" direction="column" align="center">
          <Text color="brand" weight="bold">
            {meeting.start_time}
          </Text>
          <Text color="brand">{formatDuration(meeting.expected_duration)}</Text>
        </Box>

        <Box gridArea="heldOn" margin="auto 0px">
          {isRepeat && (
            <>
              <Box direction="row" justify="between">
                <Text color="brand" size="xsmall">
                  {intl.formatDate(new Date(meeting.start))}
                </Text>
                <Text color="brand" size="xsmall">
                  &gt;&gt;
                </Text>
                <Text color="brand" size="xsmall">
                  {intl.formatDate(new Date(meeting.end))}
                </Text>
              </Box>
              <Box flex direction="row" justify="between">
                {weekDays.map((day, index) => (
                  <Box
                    key={day}
                    pad="xxsmall"
                    round="xsmall"
                    width="10%"
                    background={holdOn[index] ? 'brand' : 'default'}
                    align="center"
                  >
                    <Text
                      color={holdOn[index] ? 'light-1' : 'default'}
                      weight={holdOn[index] ? 'bold' : 'normal'}
                      size="xsmall"
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
          {onJoin ? (
            <Button
              label={intl.formatMessage(messages.joinLabel)}
              primary
              disabled={!maybeInProgress}
              onClick={() => onJoin(meeting)}
            />
          ) : (
            <Button
              label={intl.formatMessage(messages.joinLabel)}
              primary
              disabled={!maybeInProgress}
              as={({ children, type, className }) =>
                maybeInProgress ? (
                  <Link type={type} className={className} to={`${baseJitsiUrl}/m/${meeting.id}`}>
                    {children}
                  </Link>
                ) : (
                  <Box className={className}>{children}</Box>
                )
              }
            />
          )}
        </Box>
      </Grid>
    </Card>
  );
}
