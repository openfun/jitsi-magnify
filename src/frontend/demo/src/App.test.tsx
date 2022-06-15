import App from './App';
import { render, screen } from '@testing-library/react';
import { TranslationProvider } from '@jitsi-magnify/core';

describe('App', () => {
  it('renders the test button', () => {
    render(
      <TranslationProvider locale="en-US" defaultLocale="en-US" messages={{}}>
        <App />
      </TranslationProvider>,
    );
    screen.getByRole('button', { name: 'Test Button' });
    screen.getByRole('heading', { name: 'Welcome to Magnify!' });
  });
});
