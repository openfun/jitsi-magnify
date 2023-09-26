import { CunninghamProvider, DefaultTokens } from '@openfun/cunningham-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Grommet } from 'grommet';
import * as React from 'react';
import { PropsWithChildren, useEffect, useMemo } from 'react';
import {
  AuthContextProvider,
  ModalContextProvider,
  NotificationContextProvider,
} from '../../../context';
import { TranslationProvider } from '../../../i18n';
import { FormErrors } from '../../../i18n/FormErrors';
import { AuthMiddleware } from '../../../middleware';
import { HttpService } from '../../../services';
import { getCustomTheme } from '../../../themes';
import { MagnifyConfiguration } from '../../../types/config';
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
  config: MagnifyConfiguration;
  cunninghamTheme?: DefaultTokens;
}

export const MagnifyProvider = ({
  locale,
  config,
  cunninghamTheme = {},
  ...props
}: PropsWithChildren<MagnifyProviderProps>) => {
  const themeConfig = useMemo(() => {
    return getCustomTheme(cunninghamTheme);
  }, [cunninghamTheme]);

  useEffect(() => {
    HttpService.init(config.API_URL);
    window.config = config;
  }, [config]);

  return (
    <TranslationProvider locale={locale || config.LANGUAGE_CODE}>
      <FormErrors />
      <Grommet full theme={themeConfig}>
        <CunninghamProvider>
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
        </CunninghamProvider>
      </Grommet>
    </TranslationProvider>
  );
};
