import { loginHandlers } from './allHandlers/login/loginHandlers';
import { roomsHandlers } from './allHandlers/rooms/roomsHandlers';
import { usersHandlers } from './allHandlers/users/usersHandlers';

export const handlers = [...loginHandlers, ...roomsHandlers, ...usersHandlers];
