import { loginHandlers } from './handlers/login/loginHandlers';
import { roomsHandlers } from './handlers/rooms/roomsHandlers';

export const handlers = [...loginHandlers, ...roomsHandlers];
