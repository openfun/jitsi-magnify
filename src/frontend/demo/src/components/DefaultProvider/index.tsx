import { RoutingContextProvider } from '@jitsi-magnify/core';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { AccountPath } from '../../utils/routes/account';
import { AuthPath } from '../../utils/routes/auth';
import { JitsiPath } from '../../utils/routes/jitsi';
import { MeetingsPath } from '../../utils/routes/meetings';
import { RoomsPath } from '../../utils/routes/rooms';
import { RootPath } from '../../utils/routes/root';

export interface DefaultProviderProps {
  children: React.ReactNode;
}

export const DefaultProvider = ({ ...props }: DefaultProviderProps) => {
  const navigate = useNavigate();

  return (
    <RoutingContextProvider
      routes={{
        goToDefaultPage: () => navigate(RootPath.ROOT),
        goToLogout: () => navigate(AuthPath.LOGIN),
        goToLogin: () => navigate(AuthPath.LOGIN),
        goToRegister: () => navigate(AuthPath.REGISTER),
        goToAccount: () => navigate(AccountPath.ACCOUNT),
        goToJitsiRoom: (roomId: string) => {
          navigate(JitsiPath.WEB_CONF.replace(':id', roomId));
        },
        goToRoomsList: () => navigate(RoomsPath.ROOMS),
        goToMeetingList: () => navigate(MeetingsPath.MEETINGS),
        goToRoomSettings: (roomId?: string) => {
          if (roomId) {
            navigate(RoomsPath.ROOMS_SETTINGS.replace(':id', roomId));
          }
        },
      }}
    >
      {props.children}
    </RoutingContextProvider>
  );
};
