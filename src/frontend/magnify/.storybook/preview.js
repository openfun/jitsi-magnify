import theme from './theme';
import { Grommet, Text, Box } from 'grommet';
import { MemoryRouter, Routes, Route, Link, useParams } from 'react-router-dom';

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

// Simulate router behavior
function DebugRoute() {
  const params = useParams();
  return (
    <Box margin={{ top: 'xlarge' }}>
      <Text size="medium">
        <b>Router Debug</b>
        <br />
      </Text>
      <Text size="small">
        Current path: <i>{params.path || '/'}</i>
        <br />
      </Text>
      <Link to="/">Go back</Link>
    </Box>
  );
}

export const withRouter = (storyFn) => (
  <MemoryRouter>
    {storyFn()}
    <Routes>
      <Route path=":path" element={<DebugRoute />} />
    </Routes>
  </MemoryRouter>
);

// Decorators
// Decorators are added from last
export const decorators = [withRouter, withGrommet];
