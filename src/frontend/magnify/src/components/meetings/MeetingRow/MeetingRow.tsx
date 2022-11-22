import { defineMessage } from '@formatjs/intl';
import { Box, Button, ButtonExtendedProps, Card, Menu, Notification, Spinner, Text } from 'grommet';
import { MoreVertical } from 'grommet-icons';
import React from 'react';
import { useIntl } from 'react-intl';

import { useIsSmallSize } from '../../../hooks/useIsMobile';
import { Meeting } from '../../../types/entities/meeting';
import { Room } from '../../../types/entities/room';

const messages = defineMessage({
  join: {
    id: 'components.meetings.MeetingRow.join',
    defaultMessage: 'Join',
    description: 'Join the meeting',
  },
});

export default function MeetingRow(meeting: Meeting) {
  const intl = useIntl();
  const isSmallSize = useIsSmallSize();
  const menuItems: ButtonExtendedProps[] = [];

  const convertToHourMinutesFormat = (numberMinutes: number): string => {
    const nbHours = Math.floor(numberMinutes / 60);
    const nbMinutes = numberMinutes - 60 * nbHours;
    return nbHours > 0 ? `${nbHours} h ${nbMinutes} min` : `${nbMinutes} min`;
  };

  const zeroFormatNumber = (number: number): string => {
    return number < 10 ? '0' + number.toString() : number.toString();
  };

  const meetingDay = `${zeroFormatNumber(meeting.startDateTime.getDay())}/${zeroFormatNumber(
    meeting.startDateTime.getMonth() + 1,
  )}/${meeting.startDateTime.getFullYear()}`;

  const meetingHour = `${zeroFormatNumber(meeting.startDateTime.getHours())}:${zeroFormatNumber(
    meeting.startDateTime.getMinutes(),
  )}`;

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
          flex={{ grow: 0.3 }}
          gap={'5px'}
          justify={isSmallSize ? 'between' : 'evenly'}
        >
          <Box alignSelf="center">
            <Text color="brand" size="small">
              {meetingDay}
            </Text>
          </Box>
          <Box align="left" direction={isSmallSize ? 'row' : 'column'}>
            <Text color="brand" size="small" weight={700}>
              {meetingHour}
            </Text>
            <Text color="brand" margin={isSmallSize ? { left: 'small' } : 'none'} size="small">
              {convertToHourMinutesFormat(meeting.expectedDuration)}
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
            <Button primary fill={isSmallSize} label={intl.formatMessage(messages.join)} />
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
