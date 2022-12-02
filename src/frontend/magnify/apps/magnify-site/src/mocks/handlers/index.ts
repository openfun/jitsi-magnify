import { loginHandlers } from './login/loginHandlers';
import { roomsHandlers } from './rooms/roomsHandlers';

export const handlers = [...loginHandlers, ...roomsHandlers];
