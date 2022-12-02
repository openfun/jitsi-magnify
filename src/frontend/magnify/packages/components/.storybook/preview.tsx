import {MagnifyTestingProvider} from "../src";


export const decorators = [
  (Story) => (
      <MagnifyTestingProvider >
        <Story />
      </MagnifyTestingProvider>
  ),
];


export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};


