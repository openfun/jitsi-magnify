import React from 'react';
import { Maybe } from '../../types/misc';

export interface RoutingContextInterface {
  goToLogin: () => void;
  goToLogout: () => void;
  goToDefaultPage: () => void;
  goToRegister: () => void;
  goToAccount: () => void;
  goToPreferences: () => void;
  goToLiveKitRoom: (roomId: string) => void;
  goToRoomsList: () => void;
  goToRoomSettings: (roomId?: string) => void;
}

const RoutingContext = React.createContext<Maybe<RoutingContextInterface>>(undefined);

interface RoutingProviderProps {
  children: React.ReactNode;
  routes: RoutingContextInterface;
}

export const RoutingContextProvider = ({ ...props }: RoutingProviderProps) => {
  return <RoutingContext.Provider value={props.routes}>{props.children}</RoutingContext.Provider>;
};

export const useRouting = () => {
  const routingContext = React.useContext(RoutingContext);

  if (routingContext) {
    return routingContext;
  }

  throw new Error(`useRouting must be used within a routingContext`);
};
