import { CreateRoomData, RoomResponse, RoomsResponse, UpdateRoomData } from '../../types/api/room';
import { Room, RoomAccessRole } from '../../types/entities/room';
import { RoomsApiRoutes } from '../../utils/routes/api';
import { HttpService } from '../http/http.service';
import { RoutesBuilderService } from '../routes/RoutesBuilder.service';

export class RoomsRepository {
  static async create(data: CreateRoomData): Promise<Room> {
    const response = await HttpService.MagnifyApi.post<Room>(RoomsApiRoutes.CREATE, data);
    return response.data;
  }

  static async get(roomId?: string, guestId?: string): Promise<RoomResponse | null> {
    if (!roomId) {
      console.error('RoomsRepository - get, roomId is null');
      return null;
    }
    const url = RoutesBuilderService.build(RoomsApiRoutes.GET, { id: roomId });

    const response = await HttpService.MagnifyApi.get<RoomResponse>(url, { params: guestId ? { guest: guestId } : null });
    return response.data;
  }

  static async getAll(): Promise<Room[]> {
    const response = await HttpService.MagnifyApi.get<RoomsResponse>(RoomsApiRoutes.GET_ALL);
    return response.data.results;
  }

  static async update(roomId: string, data: Partial<UpdateRoomData>): Promise<RoomResponse> {
    const url = RoutesBuilderService.build(RoomsApiRoutes.UPDATE, { id: roomId });
    const response = await HttpService.MagnifyApi.patch<RoomResponse>(url, data);
    return response.data;
  }

  static async delete(roomId?: string): Promise<RoomResponse | null> {
    if (!roomId) {
      console.error('RoomsRepository - delete, roomId is null');
      return null;
    }
    const url = RoutesBuilderService.build(RoomsApiRoutes.DELETE, { id: roomId });
    const response = await HttpService.MagnifyApi.delete<RoomResponse>(url);
    return response.data;
  }

  static async addUser(roomId: string, role: RoomAccessRole, userId: string): Promise<void> {
    await HttpService.MagnifyApi.post(RoomsApiRoutes.ADD_USER, {
      user: userId,
      resource: roomId,
      role,
    });
  }

  static async updateUser(
    roomId: string,
    role: RoomAccessRole,
    userId: string,
    accessId: string,
  ): Promise<void> {
    const url = RoutesBuilderService.build(RoomsApiRoutes.UPDATE_USER, { id: accessId });
    await HttpService.MagnifyApi.patch(url, {
      user: userId,
      resource: roomId,
      role,
    });
  }

  static async deleteUser(accessId: string): Promise<void> {
    const url = RoutesBuilderService.build(RoomsApiRoutes.DELETE_USER, { id: accessId });
    await HttpService.MagnifyApi.delete(url);
  }
}

export default RoomsRepository;
