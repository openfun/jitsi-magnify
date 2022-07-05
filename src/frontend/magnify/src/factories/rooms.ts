import { Room } from '../types/room';
import createRandomRoom from './room';

export default function createRandomRooms(
  numberOfRooms: number,
  numberOfRoomsAdmin: number,
): Room[] {
  return Array(numberOfRooms)
    .fill(0)
    .map((_, index) => createRandomRoom(index < numberOfRoomsAdmin));
}
