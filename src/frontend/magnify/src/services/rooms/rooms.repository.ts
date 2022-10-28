import { AxiosResponse } from 'axios';
import { CreateRoomData, RoomResponse, UpdateRoomData } from '../../types/api/room';
import { Room } from '../../types/entities/room';
import { RoomsApiRoutes } from '../../utils/routes/api';
import { MagnifyApi, MagnifyAuthApi } from '../http/http.service';
import { RoutesBuilderService } from '../routes/RoutesBuilder.service';

export class RoomsRepository {
  public static async create(data: CreateRoomData): Promise<Room> {
    const response = await MagnifyApi.post<Room>(RoomsApiRoutes.CREATE, data);
    return response.data;
  }

  public static async get(
    roomId?: string,
    asAuthenticatedUser: boolean = true,
  ): Promise<RoomResponse | null> {
    if (!roomId) {
      console.error('RoomsRepository - get, roomId is null');
      return null;
    }
    const url = RoutesBuilderService.build(RoomsApiRoutes.GET, { id: roomId });
    let response: AxiosResponse<RoomResponse>;
    if (asAuthenticatedUser) {
      response = await MagnifyApi.get<RoomResponse>(url);
    } else {
      response = await MagnifyAuthApi.get<RoomResponse>(url);
    }
    return response.data;
  }

  public static async getAll(): Promise<RoomResponse[]> {
    const response = await MagnifyApi.get<RoomResponse[]>(RoomsApiRoutes.GET_ALL);
    return response.data;
  }

  public static async update(roomId: string, data: Partial<UpdateRoomData>): Promise<RoomResponse> {
    const url = RoutesBuilderService.build(RoomsApiRoutes.UPDATE, { id: roomId });
    const response = await MagnifyApi.patch<RoomResponse>(url, data);
    return response.data;
  }

  public static async delete(roomId?: string): Promise<RoomResponse | null> {
    if (!roomId) {
      console.error('RoomsRepository - delete, roomId is null');
      return null;
    }
    const url = RoutesBuilderService.build(RoomsApiRoutes.DELETE, { id: roomId });
    const response = await MagnifyApi.delete<RoomResponse>(url);
    return response.data;
  }
}

export default RoomsRepository;
