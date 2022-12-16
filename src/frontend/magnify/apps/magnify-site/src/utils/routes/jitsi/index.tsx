import React from 'react';
import { RouteObject } from 'react-router-dom';

import { RoomsJitsiView } from '../../../views/rooms/jitsi';
export enum JitsiPath {
  WEB_CONF = '/:id',
}

export const getJitsiRoutes = (): RouteObject => {
  return {
    path: JitsiPath.WEB_CONF,
    element: <RoomsJitsiView />,
  };
};
