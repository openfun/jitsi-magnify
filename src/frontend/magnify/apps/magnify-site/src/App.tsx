import './App.css';
import { MagnifyProvider } from '@openfun/magnify-components';
import React from 'react';
import { AppRouter } from './components/AppRouter';

export default function App() {
  return (
    <MagnifyProvider>
      <AppRouter />
    </MagnifyProvider>
  );
}
