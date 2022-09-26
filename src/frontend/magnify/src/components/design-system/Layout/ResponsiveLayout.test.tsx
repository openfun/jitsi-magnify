import { render, screen } from '@testing-library/react';
import { Grommet, ResponsiveContext } from 'grommet';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { BrowserRouter } from 'react-router-dom';

import theme from '../../../themes/theme';
import ResponsiveLayout from './ResponsiveLayout';

describe('Should show a ResponsiveLayout', () => {
  const Wrapper = ({ size }: { size: string }) => (
    <Grommet theme={theme}>
      <IntlProvider locale="en">
        <ResponsiveContext.Provider value={size}>
          <ResponsiveLayout>
            <div>Hello !</div>
          </ResponsiveLayout>
        </ResponsiveContext.Provider>
      </IntlProvider>
    </Grommet>
  );
  it('display ResponsiveLayout', async () => {
    render(<Wrapper size={'large'} />, {
      wrapper: BrowserRouter,
    });
    screen.getByText('Hello !');
  });
});
