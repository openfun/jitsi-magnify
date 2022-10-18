import {MagnifyTestingProvider} from '../src';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};



const withMagnify = (storyFn) => (
    <MagnifyTestingProvider initialUser={{
      email: 'john.doe@gmail.com',
      username: 'JohnDoe',
      name: 'John Doe'
    }}>
      {storyFn()}
    </MagnifyTestingProvider>
);

// Decorators
// export const decorators = [ withAuthContext, withGrommet, withIntl, withController, withQuery];
export const decorators = [withMagnify];
