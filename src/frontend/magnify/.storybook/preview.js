import theme from './theme';
import { Grommet } from 'grommet';
import { IntlProvider } from 'react-intl';
import messages from '../src/translations/fr-FR.json';
import { ControllerProvider, LogController } from '../src/controller';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

const controller = new LogController();

// Grommet wrapper decorator
const withGrommet = (storyFn) => <Grommet theme={theme}>{storyFn()}</Grommet>;

// Intl wrapper decorator
const withIntl = (storyFn) => (
  <IntlProvider locale="fr" messages={messages}>
    {storyFn()}
  </IntlProvider>
);

// Controller to access the backend. Here we use a console.log controller
const withController = (storyFn) => (
  <ControllerProvider controller={controller}>{storyFn()}</ControllerProvider>
);

// Decorators
export const decorators = [withGrommet, withIntl, withController];
