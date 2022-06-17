import App from './App';
import { render, screen } from '@testing-library/react';
import { ControllerProvider, TranslationProvider, MockController } from '@jitsi-magnify/core';

describe('App', () => {
  it('renders the test button', () => {
    const controller = new MockController();
    render(
      <TranslationProvider locale="en-US" defaultLocale="en-US" messages={{}}>
        <ControllerProvider controller={controller}>
          <App />
        </ControllerProvider>
      </TranslationProvider>,
    );
    screen.getByRole('button', { name: 'Test Button' });
    screen.getByRole('heading', { name: 'Welcome to Magnify!' });
  });
});
