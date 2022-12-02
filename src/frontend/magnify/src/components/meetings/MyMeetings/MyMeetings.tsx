import { Box, Card, Text } from 'grommet';
import { Heading } from 'grommet/components';
import React from 'react';
import { defineMessages } from 'react-intl';
import { useTranslations } from '../../../i18n';
import { Meeting } from '../../../types/entities/meeting';
import MeetingRow from '../MeetingRow';
import RegisterMeeting from '../RegisterMeeting/RegisterMeeting';

const messages = defineMessages({
  myMeetingsCardTitle: {
    id: 'components.rooms.myMeetings.myMeetingCardTitle',
    defaultMessage: 'List of meetings',
    description: 'Displayed text for list of meetings',
  },
  emptyMeetingsListMessage: {
    id: 'components.rooms.myMeetings.emptyMeetingsListMessage',
    defaultMessage: 'No meeting was created yet.',
    description: 'The message to display when there are no meetings.',
  },
});

export interface MyMeetingsProps {
  meetings: Meeting[] | undefined;
}

const MyMeetings = ({ meetings = [] }: MyMeetingsProps) => {
  const intl = useTranslations();
  return (
    <Card background={'white'} gap={'small'} pad={'medium'}>
      <Box align={'center'} direction={'row'} flex={true} justify={'between'}>
        <Heading level={4}>
          {intl.formatMessage(messages.myMeetingsCardTitle)}
          {meetings?.length > 0 ? ` (${meetings?.length})` : ''}
        </Heading>
        <div>
          <RegisterMeeting />
        </div>
      </Box>
      {meetings?.length > 0 ? (
        meetings.map((meeting) => {
          return <MeetingRow key={meeting.id} meeting={meeting} />;
        })
      ) : (
        <Text alignSelf="center" size="small">
          {intl.formatMessage(messages.emptyMeetingsListMessage)}
        </Text>
      )}
    </Card>
  );
};

export default MyMeetings;
