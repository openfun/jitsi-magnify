import '@testing-library/jest-dom/vitest';
import 'vitest-dom/extend-expect';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { HttpService } from './src';
import { server } from './src/mocks/server';
import { TESTING_CONF } from './src/types/config';

module.exports = async () => {
  process.env.TZ = 'UTC';
};

const noop = () => {};
Object.defineProperty(window, 'scrollTo', { value: noop, writable: true });

// Establish API mocking before all tests.
beforeAll(() => {
  HttpService.init(TESTING_CONF.API_URL);
  server.listen();
});
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => {
  server.resetHandlers();
});
// Clean up after the tests are finished.
afterAll(() => server.close());
