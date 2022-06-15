import theme from './theme';
import { Grommet } from 'grommet';
import { IntlProvider } from 'react-intl';
import messages from "../src/translations/fr-FR.json";

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

// Intl wrapper decorator
export const withIntl = (storyFn) => <IntlProvider locale="fr" messages={messages}>{storyFn()}</IntlProvider>;

// Decorators
export const decorators = [withGrommet, withIntl];
