import { Grommet } from "grommet";
import { IntlProvider } from 'react-intl';
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

// Wait for the DOM to load before we scour it for an element that requires React to be rendered
async function render() {
  // Determine the BCP47/RFC5646 locale to use
  const locale = document.querySelector('html')!.getAttribute('lang');
  console.log(locale);
  if (!locale) {
    throw new Error('<html> lang attribute is required to be set with a BCP47/RFC5646 locale.');
  }

  // Load our own strings for the given lang
  let translatedMessages: any = null;
  try {
    translatedMessages = await import(`./translations/${locale}.json`);
  } catch (e) {
    console.log('No localization file found for default en-US locale, using default messages.');
  }

  root.render(
    <IntlProvider locale={locale} messages={translatedMessages} defaultLocale="en-US">
      <React.StrictMode>
        <Grommet>
          <App />
        </Grommet>
      </React.StrictMode>
    </IntlProvider>
  );
}

document.addEventListener('DOMContentLoaded', render);
