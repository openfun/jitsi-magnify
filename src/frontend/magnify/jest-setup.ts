import '@testing-library/jest-dom';

Object.defineProperty(window, 'scrollTo', { value: jest.fn, writable: true });
jest.setTimeout(10000);
