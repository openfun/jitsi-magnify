import theme from './theme';
import { Grommet } from 'grommet';
import { MemoryRouter } from 'react-router-dom';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

// Grommet wrapper decorator
export const withGrommet = (storyFn) => <Grommet theme={theme}>{storyFn()}</Grommet>;

export const withRouter = (storyFn) => <MemoryRouter>{storyFn()}</MemoryRouter>;

// Decorators
// Decorators are added from last
export const decorators = [withRouter, withGrommet];
