import { ControllerProvider, MockController, TranslationProvider } from '@jitsi-magnify/core';
import { render, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import App from './App';

describe('App', () => {
  it('renders the test button', async () => {
    const controller = new MockController();
    controller.getMyProfile.mockResolvedValue({ name: 'John Doe' });
    controller.getMyRooms.mockResolvedValue([]);
    controller._jwt = 'access-token';
    render(
      <TranslationProvider defaultLocale="en-US" locale="en-US" messages={{}}>
        <ControllerProvider controller={controller}>
          <QueryClientProvider client={new QueryClient()}>
            <App />
          </QueryClientProvider>
        </ControllerProvider>
      </TranslationProvider>,
    );

    // Wait for the loading of the examples (initial fetch)
    await waitFor(() => expect(controller.getMyProfile).toHaveBeenCalled());
    await waitFor(() => expect(controller.getMyRooms).toHaveBeenCalled());
  });
});
