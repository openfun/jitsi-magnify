import { JitsiMeeting } from '@jitsi-magnify/core';
import { useParams } from 'react-router-dom';

export default function JitsiView() {
  const { meetingId, roomSlug } = useParams();

  return <JitsiMeeting jitsiDomain="localhost:8443" meetingId={meetingId} roomSlug={roomSlug} />;
}
