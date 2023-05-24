import { faker } from '@faker-js/faker';
import { rest } from 'msw';
import { buildApiUrl, RoutesBuilderService } from '../../../services';
import { Room, RoomAccessRole } from '../../../types';
import { MagnifyLocales, RoomsApiRoutes } from '../../../utils';

export const defaultRoom: Room = {
  id: '123',
  name: 'test-room',
  slug: 'test-room',
  is_public: false,
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
  rest.patch(
    RoutesBuilderService.buildWithBaseUrl(RoomsApiRoutes.UPDATE, { id: ':id' }),
    (req, res, ctx) => {
      return res(ctx.json(defaultRoom));
    },
  ),
];
