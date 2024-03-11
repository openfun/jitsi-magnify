import { Room } from '../../entities';

export interface RoomResponse extends Room { }
export interface RoomsResponse {
  count: number;
  results: Room[];
}
export interface CreateRoomData {
  name: string;
}
export interface UpdateRoomData extends Room { }
