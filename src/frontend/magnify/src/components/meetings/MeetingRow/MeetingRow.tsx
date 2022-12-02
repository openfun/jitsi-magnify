import { defineMessage } from '@formatjs/intl';
import { Box, Button, ButtonExtendedProps, Card, Menu, Notification, Spinner, Text } from 'grommet';
import { MoreVertical } from 'grommet-icons';
import { Interval } from 'luxon';
import React from 'react';
import { useIntl } from 'react-intl';
import { useRouting } from '../../../context';

import { useIsSmallSize } from '../../../hooks/useIsMobile';
import { Meeting } from '../../../types/entities/meeting';

export interface MeetingRowProps {
  meeting: Meeting;
}

const messages = defineMessage({
  join: {
    id: 'components.meetings.MeetingRow.join',
    defaultMessage: 'Join',
    description: 'Join the meeting',
  },
});

export default function MeetingRow({ meeting }: MeetingRowProps) {
  const intl = useIntl();
  const isSmallSize = useIsSmallSize();
  const menuItems: ButtonExtendedProps[] = [];
  const startDateTime: Date = new Date(meeting.startDateTime);
  const endDateTime: Date = new Date(meeting.endDateTime);
  const routing = useRouting();

  const meetingDay = startDateTime.toLocaleDateString(intl.locale, {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  });

  const meetingHour = startDateTime.toLocaleTimeString(intl.locale, {
    timeStyle: 'short',
  });

  const expectedDuration = Interval.fromDateTimes(startDateTime, endDateTime).toDuration([
    'hours',
    'minutes',
  ]);

  return (
    <Card background="light-2" elevation="0" pad="small" style={{ position: 'relative' }}>
      <Box
        align={'center'}
        direction={isSmallSize ? 'column' : 'row'}
        gap={'20px'}
        justify={isSmallSize ? 'center' : 'between'}
        pad={isSmallSize ? 'small' : 'none'}
      >
        <Box
          direction="row"
          fill={isSmallSize}
          gap={'30px'}
          justify={isSmallSize ? 'between' : 'evenly'}
        >
          <Box alignSelf="center">
            <Text color="brand" size="small">
              {meetingDay}
            </Text>
          </Box>
          <Box
            align="left"
            direction={isSmallSize ? 'row' : 'column'}
            gap={isSmallSize ? '10px' : 'none'}
            justify={isSmallSize ? 'between' : 'stretch'}
          >
            <Text color="brand" size="small" weight={700}>
              {meetingHour}
            </Text>
            <Text color="brand" size="small">
              {`${expectedDuration.hours}h ${Math.floor(expectedDuration.minutes)}min`}
            </Text>
          </Box>
        </Box>
        <Box alignSelf="start" direction="row" gap="small" margin="auto 0px">
          <Box margin="auto 0px">
            <Text color="brand" size="medium" truncate={'tip'} weight="bold">
              {meeting.room ? meeting.room.name : meeting.name}
            </Text>
          </Box>
        </Box>
        <Box align={'center'} direction="row" fill={isSmallSize} margin="auto 0px">
          <Box flex={{ grow: 1 }}>
            <Button
              primary
              fill={isSmallSize}
              label={intl.formatMessage(messages.join)}
              onClick={() =>
                meeting.room
                  ? routing.goToJitsiRoom(meeting.room.slug)
                  : routing.goToJitsiRoom(meeting.name)
              }
            />
          </Box>
          <Menu
            dropProps={{ align: { top: 'bottom', left: 'left' } }}
            icon={<MoreVertical size={'medium'} />}
            items={menuItems}
            justifyContent={'center'}
          />
        </Box>
      </Box>
    </Card>
  );
}
