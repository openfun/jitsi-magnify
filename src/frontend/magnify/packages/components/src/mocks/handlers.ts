import { loginHandlers } from './allHandlers/login/loginHandlers';
import { roomsHandlers } from './allHandlers/rooms/roomsHandlers';

export const handlers = [...loginHandlers, ...roomsHandlers];
