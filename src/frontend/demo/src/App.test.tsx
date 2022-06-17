import App from './App';
import { render, screen, waitFor } from '@testing-library/react';
import { ControllerProvider, TranslationProvider, MockController } from '@jitsi-magnify/core';

describe('App', () => {
  it('renders the test button', async () => {
    const controller = new MockController();
    controller.getExamples.mockResolvedValue([]);
    render(
      <TranslationProvider locale="en-US" defaultLocale="en-US" messages={{}}>
        <ControllerProvider controller={controller}>
          <App />
        </ControllerProvider>
      </TranslationProvider>,
    );

    // Wait for the loading of the examples (initial fetch)
    await waitFor(() => expect(controller.getExamples).toHaveBeenCalled());

    // Verify translations
    screen.getByRole('button', { name: 'Test Button' });
    screen.getByRole('heading', { name: 'Welcome to Magnify!' });
  });
});
