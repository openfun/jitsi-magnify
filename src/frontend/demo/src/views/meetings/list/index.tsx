import { MyMeetings, createRandomMeeting } from '@jitsi-magnify/core';
import * as React from 'react';
import { DefaultPage } from '../../../components/DefaultPage';

export function MeetingsListView() {
  const myMeetings: string | null = localStorage.getItem('meetings');
  const myMeetingsList: any = myMeetings ? JSON.parse(myMeetings) : [];
  const mySortedMeetingsList = myMeetingsList.sort(
    (a: any, b: any) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime(),
  );

  return (
    <DefaultPage title={'Meetings'}>
      <MyMeetings meetings={mySortedMeetingsList} />
    </DefaultPage>
  );
}
