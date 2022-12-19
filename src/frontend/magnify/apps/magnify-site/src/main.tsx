import { KeycloakService } from '@openfun/magnify-components';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import '@fontsource/roboto';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

async function render() {
  KeycloakService.initKeycloak(window.location.href, () => {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
  });
}

document.addEventListener('DOMContentLoaded', render);
