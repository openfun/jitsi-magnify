import { CunninghamProvider } from '@openfun/cunningham-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Grommet } from 'grommet';
import { useEffect, PropsWithChildren } from 'react';
import {
  AuthContextProvider,
  ModalContextProvider,
  NotificationContextProvider,
} from '../../../context';
import { RoutingContextInterface, RoutingContextProvider } from '../../../context/routing';
import { TranslationProvider } from '../../../i18n';
import { FormErrors } from '../../../i18n/FormErrors';
import { getCustomTheme } from '../../../themes';
import { TESTING_CONF } from '../../../types/config';
import { MagnifyLocales } from '../../../utils';

export type MagnifyTestingProviderProps = PropsWithChildren<{}>;

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

const locale = 'en';

export const MagnifyTestingProvider = (props: MagnifyTestingProviderProps) => {
  const getRouter = (): RoutingContextInterface => {
    return {
      goToDefaultPage: () => console.log('goToDefaultPage'),
      goToLogout: () => console.log('goToLogout'),
      goToLogin: () => console.log('goToLogin'),
      goToRegister: () => console.log('goToRegister'),
      goToAccount: () => console.log('goToAccount'),
      goToPreferences: () => console.log('goToPreferences'),
      goToJitsiRoom: () => console.log('goToJitsiRoom'),
      goToRoomsList: () => console.log('goToRoomsList'),
      goToRoomSettings: () => console.log('goToRoomSettings'),
    };
  };

  const theme = getCustomTheme();

  useEffect(() => {
    window.config = TESTING_CONF;
  }, []);

  return (
    <TranslationProvider defaultLocale="en" initTranslation={false} locale={locale}>
      <FormErrors />
      <RoutingContextProvider routes={getRouter()}>
        <CunninghamProvider>
          <Grommet theme={theme}>
            <QueryClientProvider client={queryClient}>
              <AuthContextProvider
                initialUser={{
                  id: '123',
                  email: 'john.doe@gmail.com',
                  username: 'JohnDoe',
                  name: 'John Doe',
                  language: MagnifyLocales.EN,
                }}
              >
                <NotificationContextProvider>
                  <ModalContextProvider>{props.children}</ModalContextProvider>
                </NotificationContextProvider>
              </AuthContextProvider>
            </QueryClientProvider>
          </Grommet>
        </CunninghamProvider>
      </RoutingContextProvider>
    </TranslationProvider>
  );
};
