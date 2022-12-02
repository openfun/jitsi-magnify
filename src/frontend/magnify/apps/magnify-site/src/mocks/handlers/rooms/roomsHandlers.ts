import { buildApiUrl, Room, RoomsApiRoutes } from '@openfun/magnify-components';
import { rest } from 'msw';

export const defaultRoom: Room = {
  id: '123',
  name: 'test-room',
  slug: 'test-room',
  jitsi: {
    room: 'test-room',
    token: '123',
  },
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
