import { KeycloakService, MagnifyConfiguration, MagnifyProvider } from '@openfun/jitsi-magnify';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { tokens as cunningham } from './cunningham-tokens';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

async function render() {
  fetch('/config.json').then(async (response) => {
    const config: MagnifyConfiguration = await response.json();
    KeycloakService.initKeycloak(
      window.location.href,
      {
        realm: config.KEYCLOAK_REALM,
        clientId: config.KEYCLOAK_CLIENT_ID,
        url: config.KEYCLOAK_URL,
      },
      () => {
        root.render(
          <React.StrictMode>
            <MagnifyProvider config={config} cunninghamTheme={cunningham}>
              <App />
            </MagnifyProvider>
          </React.StrictMode>,
        );
      },
    );
  });
}

document.addEventListener('DOMContentLoaded', render);
