import React, { createContext, useEffect } from 'react';
import { Nullable } from '../types/misc';
import { Profile } from '../types/profile';
import Controller from './interface';
import { ConnexionStatus, defaultStore, Store } from './store';

const ControllerContext = createContext<{
  controller: Controller | null;
  store: Store;
  setStore: React.Dispatch<React.SetStateAction<Store>>;
}>({
  controller: null,
  store: defaultStore,
  setStore: () => {},
});

interface ControllerProviderProps {
  /**
   * The app, wrapped by this controller
   */
  children: React.ReactNode;
  /**
   * The controller to use
   */
  controller: Controller;
}

export default function ControllerProvider({ children, controller }: ControllerProviderProps) {
  const [store, setStore] = React.useState<Store>(defaultStore);

  useEffect(() => {
    controller.registerSetStore(setStore);
  });

  return (
    <ControllerContext.Provider value={{ controller, store, setStore }}>
      {children}
    </ControllerContext.Provider>
  );
}

/**
 * Hook to get the controller from the context
 * @returns the controller
 */
export function useController(): Controller {
  const { controller } = React.useContext(ControllerContext);
  if (!controller) {
    throw new Error('useController must be used within a ControllerProvider');
  }
  return controller;
}

export function useStore(): {
  store: Store;
  setStore: React.Dispatch<React.SetStateAction<Store>>;
  user: Nullable<Profile>;
  setUser: React.Dispatch<React.SetStateAction<Nullable<Profile>>>;
  connexionStatus: ConnexionStatus;
  setConnexionStatus: React.Dispatch<React.SetStateAction<ConnexionStatus>>;
} {
  const { store, setStore } = React.useContext(ControllerContext);

  const { user, connexionStatus } = store;

  return {
    // general
    store,
    setStore,

    // user
    user,
    setUser: (user: Nullable<Profile> | ((p: Nullable<Profile>) => Nullable<Profile>)) =>
      setStore(
        (pStore): Store => ({
          ...pStore,
          user: typeof user === 'function' ? user(pStore.user) : user,
        }),
      ),

    // connexion
    connexionStatus,
    setConnexionStatus: (status: ConnexionStatus | ((p: ConnexionStatus) => ConnexionStatus)) =>
      setStore(
        (pStore): Store => ({
          ...pStore,
          connexionStatus: typeof status === 'function' ? status(pStore.connexionStatus) : status,
        }),
      ),
  };
}
