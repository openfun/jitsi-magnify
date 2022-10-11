import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { defineMessages } from 'react-intl';
import { useController } from '../../../controller';
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
  const { data: meetings, isLoading } = useQuery(['meetings'], controller.getMyMeetings);

  return (
    <RowsList
      Row={({ meeting }) => <MeetingRow baseJitsiUrl={baseJitsiUrl} meeting={meeting} />}
      isLoading={isLoading}
      label={messages.meetingsListLabel}
      rows={(meetings || []).map((meeting) => ({ meeting, id: meeting.id }))}
    />
  );
};

export default MyMeetings;
