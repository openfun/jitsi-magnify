import theme from "./theme";
import { Grommet } from "grommet";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

// Grommet wrapper decorator
export const withGrommet = (storyFn) => (
  <Grommet theme={theme}>{storyFn()}</Grommet>
);

// Decorators
export const decorators = [withGrommet];
