import { rest } from 'msw';
import { buildApiUrl } from '../../../services/http/http.service';
import { Room } from '../../../types/entities/room';
import { RoomsApiRoutes } from '../../../utils/routes/api';

export const defaultRoom: Room = {
  id: '123',
  name: 'test-room',
  slug: 'test-room',
  is_administrable: true,
};

export const roomsHandlers = [
  rest.get(buildApiUrl(RoomsApiRoutes.GET_ALL), (req, res, ctx) => {
    return res(ctx.json([defaultRoom]));
  }),
  rest.post(buildApiUrl(RoomsApiRoutes.CREATE), (req, res, ctx) => {
    return res(ctx.json(defaultRoom));
  }),
];
