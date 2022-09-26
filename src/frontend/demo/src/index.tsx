import {
  ControllerProvider,
  defaultTheme,
  loadLocaleData,
  LogController,
  TranslationProvider,
} from '@jitsi-magnify/core';
import { Grommet } from 'grommet';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

async function render() {
  // Determine the BCP47/RFC5646 locale to use
  // const locale = document.querySelector('html')!.getAttribute('lang') || 'en-US';
  const locale = 'en-US';

  // Load our own strings for the given lang, and the strings from the lib
  let translatedMessages: Record<string, string> | undefined;
  try {
    translatedMessages = {
      ...((await import(`./translations/${locale}.json`)).default || {}),
      ...((await loadLocaleData(locale)) || {}),
    };
  } catch (error) {
    translatedMessages = {};
  }

  // Create the controller
  // const controller = new DefaultController({ url: 'http://localhost:3000' });
  const controller = new LogController(process.env.REACT_APP_TEST_TOKEN as string);
  // controller.refreshActivated = false;
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });
  // Render the app inside the required providers
  root.render(
    <TranslationProvider defaultLocale="en-US" locale={locale} messages={translatedMessages || {}}>
      <React.StrictMode>
        <Grommet full theme={defaultTheme}>
          <QueryClientProvider client={queryClient}>
            <ControllerProvider controller={controller}>
              <App />
            </ControllerProvider>
          </QueryClientProvider>
        </Grommet>
      </React.StrictMode>
    </TranslationProvider>,
  );
}

document.addEventListener('DOMContentLoaded', render);
