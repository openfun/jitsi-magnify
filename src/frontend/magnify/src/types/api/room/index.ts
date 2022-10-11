import { Room } from '../../entities/room';

export interface RoomResponse extends Room {}
export interface CreateRoomData {
  name: string;
}
export interface UpdateRoomData extends Room {}
