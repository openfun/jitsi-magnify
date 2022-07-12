import { defineMessages } from 'react-intl';
import React from 'react';
import { useController } from '../../../controller';
import { useQuery } from 'react-query';
import { RowsList } from '../../design-system';
import MeetingRow from '../MeetingRow';

export interface MyMeetingsProps {
  baseJitsiUrl: string;
}

const messages = defineMessages({
  meetingsListLabel: {
    id: 'components.meetings.myMeetings.meetingsListLabel',
    defaultMessage: 'My meetings',
    description: 'Label for the list of meetings',
  },
});

const MyMeetings = ({ baseJitsiUrl }: MyMeetingsProps) => {
  const controller = useController();
  const { data: meetings, isLoading } = useQuery('meetings', controller.getMyMeetings);

  return (
    <RowsList
      label={messages.meetingsListLabel}
      rows={(meetings || []).map((meeting) => ({ meeting, id: meeting.id }))}
      Row={({ meeting }) => <MeetingRow meeting={meeting} baseJitsiUrl={baseJitsiUrl} />}
      isLoading={isLoading}
    />
  );
};

export default MyMeetings;
