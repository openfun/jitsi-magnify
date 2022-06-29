import '@testing-library/jest-dom';
import { setLogger } from 'react-query';

Object.defineProperty(window, 'scrollTo', { value: jest.fn, writable: true });

// During tests we want queries to be silent
// see https://react-query.tanstack.com/guides/testing#turn-off-network-error-logging
setLogger({ log: console.log, warn: console.warn, error: () => {} });
