import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Grommet } from 'grommet';
import * as React from 'react';
import { PropsWithChildren } from 'react';
import {
  AuthContextProvider,
  ModalContextProvider,
  NotificationContextProvider,
} from '../../../context';
import { TranslationProvider } from '../../../i18n';
import { FormErrors } from '../../../i18n/FormErrors';
import { AuthMiddleware } from '../../../middleware';
import { defaultTheme } from '../../../themes';
import { User } from '../../../types/entities/user';

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

export interface MagnifyProviderProps {
  initialUser?: User;
  translations?: any;
  locale?: string;
}

export function MagnifyProvider({ locale, ...props }: PropsWithChildren<MagnifyProviderProps>) {
  return (
    <TranslationProvider locale={locale}>
      <FormErrors />
      <Grommet full theme={defaultTheme}>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <AuthContextProvider initialUser={props.initialUser}>
            <AuthMiddleware>
              <NotificationContextProvider>
                <ModalContextProvider>{props.children}</ModalContextProvider>
              </NotificationContextProvider>
            </AuthMiddleware>
          </AuthContextProvider>
        </QueryClientProvider>
      </Grommet>
    </TranslationProvider>
  );
}
