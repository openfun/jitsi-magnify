import '@testing-library/jest-dom';

Object.defineProperty(window, 'scrollTo', { value: jest.fn, writable: true });

module.exports = async () => {
  process.env.TZ = 'UTC';
};
