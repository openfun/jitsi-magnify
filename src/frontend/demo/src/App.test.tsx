import { ControllerProvider, TranslationProvider, MockController } from '@jitsi-magnify/core';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

describe('App', () => {
  it('renders the test button', async () => {
    const controller = new MockController();
    controller.getMyProfile.mockResolvedValue({ name: 'John Doe' });
    controller.getExamples.mockResolvedValue([]);
    controller._jwt = 'access-token';
    render(
      <TranslationProvider defaultLocale="en-US" locale="en-US" messages={{}}>
        <ControllerProvider controller={controller}>
          <QueryClientProvider client={new QueryClient()}>
            <MemoryRouter>
              <App />
            </MemoryRouter>
          </QueryClientProvider>
        </ControllerProvider>
      </TranslationProvider>,
    );

    // Wait for the loading of the examples (initial fetch)
    await waitFor(() => expect(controller.getMyProfile).toHaveBeenCalled());
    await waitFor(() => expect(controller.getExamples).toHaveBeenCalled());

    // Verify translations
    screen.getByRole('button', { name: 'Test Button' });
    screen.getByRole('heading', { name: 'Welcome to Magnify!' });
  });
});
