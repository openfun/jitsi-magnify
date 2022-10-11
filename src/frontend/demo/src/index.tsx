import { MagnifyProvider } from '@jitsi-magnify/core';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

async function render() {
  // Render the app inside the required providers
  root.render(
    <React.StrictMode>
      <MagnifyProvider>
        <App />
      </MagnifyProvider>
    </React.StrictMode>,
  );
}

document.addEventListener('DOMContentLoaded', render);
