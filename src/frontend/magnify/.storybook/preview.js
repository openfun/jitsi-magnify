import { defaultTheme } from '../src';
import { Grommet, Text, Box } from 'grommet';
import { MemoryRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import messages from '../src/translations/fr-FR.json';
import { ControllerProvider, LogController } from '../src/controller';
import { QueryClientProvider, QueryClient } from 'react-query';
import DebugRoute from "../src/utils/DebugRoute";

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
const queryClient = new QueryClient();

// Grommet wrapper decorator
const withGrommet = (storyFn) => <Grommet theme={defaultTheme}>{storyFn()}</Grommet>;

// Simulate router behavior

export const withRouter = (storyFn) => (
  <MemoryRouter>
    {storyFn()}
    <Routes>
      <Route path="*" element={<DebugRoute />} />
    </Routes>
  </MemoryRouter>
);

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

// query decorator
const withQuery = (storyFn) => (
  <QueryClientProvider client={queryClient}>{storyFn()}</QueryClientProvider>
);

// Decorators
export const decorators = [withRouter, withGrommet, withIntl, withController, withQuery];
