import { MagnifyProvider } from '@openfun/magnify-components';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import '@fontsource/roboto'; // Defaults to weight 400.

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

async function render() {
  // Render the app inside the required providers
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

document.addEventListener('DOMContentLoaded', render);
