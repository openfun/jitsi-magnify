import { Meeting } from '../types/meeting';
import { Room } from '../types/room';
import { WithToken } from '../types/withToken';

/**
 * This add an example token.
 * This token only works if the jitsi instance has the secret "ThisIsAnExampleKeyForDevPurposeOnly"
 */

export default function withToken<T extends Room | Meeting>(
  object: T,
  testToken: string,
): WithToken<T> {
  console.log(testToken);
  return {
    ...object,
    token: testToken,
    jitsiRoomName:
      'slug' in object ? `magnify-room-${object.slug}` : `magnify-meeting-${object.id}`,
  };
}
