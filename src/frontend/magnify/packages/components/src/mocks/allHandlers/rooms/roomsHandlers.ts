import { faker } from '@faker-js/faker';
import { rest } from 'msw';
import { buildApiUrl } from '../../../services/http/http.service';
import { Room, RoomAccessRole } from '../../../types/entities/room';
import { MagnifyLocales } from '../../../utils';
import { RoomsApiRoutes } from '../../../utils/routes/api';

export const defaultRoom: Room = {
  id: '123',
  name: 'test-room',
  slug: 'test-room',
  jitsi: {
    room: 'test-room',
    token: '123',
  },
  is_administrable: true,
  accesses: [
    {
      id: faker.datatype.uuid(),
      role: RoomAccessRole.OWNER,
      room: '123',
      user: {
        id: faker.datatype.uuid(),
        name: 'John Doe',
        username: 'johnDoe',
        language: MagnifyLocales.EN,
      },
    },
  ],
};

export const roomsHandlers = [
  rest.get(buildApiUrl(RoomsApiRoutes.GET_ALL), (req, res, ctx) => {
    return res(ctx.json([defaultRoom]));
  }),
  rest.post(buildApiUrl(RoomsApiRoutes.CREATE), (req, res, ctx) => {
    return res(ctx.json(defaultRoom));
  }),
  rest.post(buildApiUrl(RoomsApiRoutes.GET), (req, res, ctx) => {
    return res(ctx.json(defaultRoom));
  }),
];
