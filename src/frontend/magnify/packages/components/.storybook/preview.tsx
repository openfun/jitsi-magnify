import {MagnifyTestingProvider} from "../src";
import * as React from 'react';
import {initialize, mswDecorator} from 'msw-storybook-addon';
import {handlers} from "../src/mocks/handlers";
import '@fontsource/roboto'; // Defaults to weight 400.

// Initialize MSW
initialize();


export const decorators = [
  (Story) => (
      <MagnifyTestingProvider >
        <Story />
      </MagnifyTestingProvider>
  ),mswDecorator
];


export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  msw: {
    handlers: handlers
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};


