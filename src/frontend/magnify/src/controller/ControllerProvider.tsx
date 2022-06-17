import React, { createContext } from 'react';
import Controller from './interface';

const ControllerContext = createContext<Controller | null>(null);

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
  return <ControllerContext.Provider value={controller}>{children}</ControllerContext.Provider>;
}

/**
 * Hook to get the controller from the context
 * @returns the controller
 */
export function useController(): Controller {
  const controller = React.useContext(ControllerContext);
  if (!controller) {
    throw new Error('useController must be used within a ControllerProvider');
  }
  return controller;
}
