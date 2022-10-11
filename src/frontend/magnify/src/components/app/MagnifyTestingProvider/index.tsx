import { Router as RemixRouter } from '@remix-run/router/dist/router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Grommet } from 'grommet';
import * as React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import {
  AuthContextProvider,
  ModalContextProvider,
  NotificationContextProvider,
} from '../../../context';
import { ControllerProvider, LogController } from '../../../controller';
import { TranslationProvider } from '../../../i18n';
import { FormErrors } from '../../../i18n/FormErrors';
import { defaultTheme } from '../../../themes';

export interface MagnifyTestingProviderProps {
  children?: React.ReactNode;
  router?: RemixRouter;
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
const controller = new LogController(process.env.REACT_APP_TEST_TOKEN as string);

export const MagnifyTestingProvider = (props: MagnifyTestingProviderProps) => {
  const getRouter = (): RemixRouter => {
    if (props.router != null) {
      return props.router;
    }

    return createMemoryRouter(
      [
        {
          path: '/',
          handle: {
            crumb: () => {
              return 'Home';
            },
          },
          element: <>{props.children}</>,
        },
      ],
      { initialEntries: ['/'], initialIndex: 1 },
    );
  };

  return (
    <TranslationProvider defaultLocale="en-US" locale={locale} messages={{}}>
      <FormErrors />
      <Grommet full theme={defaultTheme}>
        <QueryClientProvider client={queryClient}>
          <AuthContextProvider
            initialUser={{
              email: 'john.doe@gmail.com',
              username: 'JohnDoe',
              name: 'John Doe',
            }}
          >
            <ControllerProvider controller={controller}>
              <NotificationContextProvider>
                <ModalContextProvider>
                  <RouterProvider router={getRouter()} />
                </ModalContextProvider>
              </NotificationContextProvider>
            </ControllerProvider>
          </AuthContextProvider>
        </QueryClientProvider>
      </Grommet>
    </TranslationProvider>
  );
};
