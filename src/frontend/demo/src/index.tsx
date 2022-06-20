import { loadLocaleData, TranslationProvider } from '@jitsi-magnify/core';
import { Grommet } from 'grommet';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

async function render() {
  // Determine the BCP47/RFC5646 locale to use
  // const locale = document.querySelector('html')!.getAttribute('lang') || 'en-US';
  const locale = 'fr-FR';

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

  // Render the app inside the required providers
  root.render(
    <TranslationProvider defaultLocale="en-US" locale={locale} messages={translatedMessages || {}}>
      <React.StrictMode>
        <BrowserRouter>
          <Grommet full>
            <App />
          </Grommet>
        </BrowserRouter>
      </React.StrictMode>
    </TranslationProvider>,
  );
}

document.addEventListener('DOMContentLoaded', render);
