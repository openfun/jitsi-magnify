import '@testing-library/jest-dom';
import { HttpService, TESTING_CONF } from '@openfun/magnify-components';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './src/mocks/server';

// Establish API mocking before all tests.
beforeAll(() => {
  HttpService.init(TESTING_CONF.API_URL);
  server.listen();
});
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());
// Clean up after the tests are finished.
afterAll(() => server.close());
