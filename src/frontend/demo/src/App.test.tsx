import App from './App';
import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { ControllerProvider, TranslationProvider, MockController } from '@jitsi-magnify/core';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

describe('App', () => {
  it('renders the test button', async () => {
    const controller = new MockController();
    controller.getMyProfile.mockResolvedValue({ name: 'John Doe' });
    controller.getExamples.mockResolvedValue([]);
    controller._jwt = 'access-token';
    render(
      <TranslationProvider locale="en-US" defaultLocale="en-US" messages={{}}>
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
