import { KeycloakService, RoutingContextProvider } from '@openfun/magnify-components';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { JitsiPath } from '../../utils/routes/jitsi';
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
        goToLogout: () => {
          KeycloakService.doLogout({
            redirectUri: window.location.href,
          });
        },
        goToLogin: () =>
          KeycloakService.doLogin({
            redirectUri: window.location.href,
          }),
        goToRegister: () =>
          KeycloakService._kc.register({
            redirectUri: window.location.href,
          }),
        goToAccount: () => {
          KeycloakService._kc.accountManagement();
        },
        goToJitsiRoom: (roomId: string) => {
          navigate(JitsiPath.WEB_CONF.replace(':id', roomId));
        },
        goToRoomsList: () => navigate(RoomsPath.ROOMS),
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
