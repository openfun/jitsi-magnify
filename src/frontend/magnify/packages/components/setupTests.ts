import '@testing-library/jest-dom';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from './src/mocks/server';

module.exports = async () => {
  process.env.TZ = 'UTC';
};

const noop = () => {};
Object.defineProperty(window, 'scrollTo', { value: noop, writable: true });

// Establish API mocking before all tests.
beforeAll(() => {
  server.listen();
});
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => {
  server.resetHandlers();
});
// Clean up after the tests are finished.
afterAll(() => server.close());
