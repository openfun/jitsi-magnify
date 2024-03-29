// Disable extraneous dependencies rule because this file is only used in development
/* eslint-disable import/no-extraneous-dependencies */
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
  livekit: {
    room: 'test-room',
    token: '123',
  },
  is_administrable: true,
  accesses: [
    {
      id: faker.string.uuid(),
      role: RoomAccessRole.OWNER,
      room: '123',
      user: {
        id: faker.string.uuid(),
        name: 'John Doe',
        username: 'johnDoe',
        language: MagnifyLocales.EN,
      },
    },
  ],
  start_with_audio_muted: false,
  start_with_video_muted: false
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
