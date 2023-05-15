import { Notification, NotificationProps } from 'grommet';
import React, { useState } from 'react';
import { Maybe } from '../../types/misc';

export interface NotificationContextInterface {
  showNotification: (notificationProps: NotificationProps) => void;
  hideNotification: () => void;
}

const NotificationContext = React.createContext<Maybe<NotificationContextInterface>>(undefined);

type NotificationProviderProps = {
  children: React.ReactNode;
};

const NotificationContextProvider = ({ ...props }: NotificationProviderProps) => {
  const [show, setShow] = useState(false);
  const [notificationProps, setNotificationProps] = useState<NotificationProps>();
  const notificationContext: NotificationContextInterface = React.useMemo(
    () => ({
      showNotification: (notifProps): void => {
        setShow(true);
        setNotificationProps(notifProps);
      },
      hideNotification: (): void => {
        setShow(false);
      },
    }),
    [show, notificationProps],
  );

  const handleClose = (): void => {
    notificationProps?.onClose?.();
    setShow(false);
  };

  return (
    <NotificationContext.Provider value={notificationContext}>
      {show && (
        <Notification
          toast={notificationProps?.toast ?? true}
          {...notificationProps}
          onClose={handleClose}
        />
      )}
      {props.children}
    </NotificationContext.Provider>
  );
};

const useNotification = () => {
  const notificationContext = React.useContext(NotificationContext);

  if (notificationContext) {
    return notificationContext;
  }

  throw new Error(`useNotification must be used within a NotificationContext`);
};

export { NotificationContextProvider, useNotification };
