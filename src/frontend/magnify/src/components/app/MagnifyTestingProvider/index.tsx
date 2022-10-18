import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Grommet } from 'grommet';
import * as React from 'react';
import {
  AuthContextProvider,
  ModalContextProvider,
  NotificationContextProvider,
} from '../../../context';
import { RoutingContextInterface, RoutingContextProvider } from '../../../context/routing';
import { TranslationProvider } from '../../../i18n';
import { FormErrors } from '../../../i18n/FormErrors';
import { defaultTheme } from '../../../themes';

export interface MagnifyTestingProviderProps {
  children?: React.ReactNode;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      retryOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  },
});

const locale = 'en-US';

export const MagnifyTestingProvider = (props: MagnifyTestingProviderProps) => {
  const getRouter = (): RoutingContextInterface => {
    const result: RoutingContextInterface = {
      goToDefaultPage: () => console.log('goToDefaultPage'),
      goToLogout: () => console.log('goToLogout'),
      goToLogin: () => console.log('goToLogin'),
      goToRegister: () => console.log('goToRegister'),
      goToAccount: () => console.log('goToAccount'),
      goToRoomsList: () => console.log('goToRoomsList'),
      goToRoomSettings: () => console.log('goToRoomSettings'),
    };

    return result;
  };

  return (
    <TranslationProvider defaultLocale="en-US" locale={locale} messages={{}}>
      <FormErrors />
      <RoutingContextProvider routes={getRouter()}>
        <Grommet full theme={defaultTheme}>
          <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false} />
            <AuthContextProvider
              initialUser={{
                email: 'john.doe@gmail.com',
                username: 'JohnDoe',
                name: 'John Doe',
              }}
            >
              <NotificationContextProvider>
                <ModalContextProvider>{props.children}</ModalContextProvider>
              </NotificationContextProvider>
            </AuthContextProvider>
          </QueryClientProvider>
        </Grommet>
      </RoutingContextProvider>
    </TranslationProvider>
  );
};
