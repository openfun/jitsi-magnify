import { AxiosResponse } from 'axios';
import { CreateMeetingData, MeetingResponse, UpdateMeetingData } from '../../types/api/meeting';
import { Meeting } from '../../types/entities/meeting';
import { MeetingsApiRoutes } from '../../utils/routes/api';
import { MagnifyApi, MagnifyAuthApi } from '../http/http.service';
import { RoutesBuilderService } from '../routes/RoutesBuilder.service';

export class MeetingsRepository {
  public static async create(data: CreateMeetingData): Promise<Meeting> {
    const response = await MagnifyApi.post<Meeting>(MeetingsApiRoutes.CREATE, data);
    return response.data;
  }

  public static async get(
    meetingId?: string,
    asAuthenticatedUser: boolean = true,
  ): Promise<MeetingResponse | null> {
    if (!meetingId) {
      console.error('MeetingsRepository - get, meetingId is null');
      return null;
    }
    const url = RoutesBuilderService.build(MeetingsApiRoutes.GET, { id: meetingId });
    let response: AxiosResponse<MeetingResponse>;
    if (asAuthenticatedUser) {
      response = await MagnifyApi.get<MeetingResponse>(url);
    } else {
      response = await MagnifyAuthApi.get<MeetingResponse>(url);
    }
    return response.data;
  }

  public static async getAll(): Promise<MeetingResponse[]> {
    const response = await MagnifyApi.get<MeetingResponse[]>(MeetingsApiRoutes.GET_ALL);
    return response.data;
  }

  public static async update(
    meetingId: string,
    data: Partial<UpdateMeetingData>,
  ): Promise<MeetingResponse> {
    const url = RoutesBuilderService.build(MeetingsApiRoutes.UPDATE, { id: meetingId });
    const response = await MagnifyApi.patch<MeetingResponse>(url, data);
    return response.data;
  }

  public static async delete(meetingId?: string): Promise<MeetingResponse | null> {
    if (!meetingId) {
      console.error('MeetingsRepository - delete, meetingId is null');
      return null;
    }
    const url = RoutesBuilderService.build(MeetingsApiRoutes.DELETE, { id: meetingId });
    const response = await MagnifyApi.delete<MeetingResponse>(url);
    return response.data;
  }
}

export default MeetingsRepository;
