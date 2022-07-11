export type WithToken<T> = T & {
  token: string;
  jitsiRoomName: string;
};
