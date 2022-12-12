import { MyMeetings, createRandomMeeting } from '@jitsi-magnify/core';
import * as React from 'react';
import { DefaultPage } from '../../../components/DefaultPage';

export function MeetingsListView() {
  return (
    <DefaultPage title={'test'}>
      <MyMeetings meetings={[createRandomMeeting(), createRandomMeeting()]} />
    </DefaultPage>
  );
}
