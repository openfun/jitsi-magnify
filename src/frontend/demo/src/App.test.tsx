import { MagnifyProvider } from '@jitsi-magnify/core';
import { act, render } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('Render the app', async () => {
    await act(() => {
      render(
        <MagnifyProvider>
          <App />
        </MagnifyProvider>,
      );
    });
  });
});
