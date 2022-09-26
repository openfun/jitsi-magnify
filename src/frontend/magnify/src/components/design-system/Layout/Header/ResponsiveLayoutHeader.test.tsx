import { render, screen } from '@testing-library/react';
import { Grommet, ResponsiveContext } from 'grommet';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { BrowserRouter } from 'react-router-dom';

import theme from '../../../../themes/theme';
import { ResponsiveLayoutHeader } from './ResponsiveLayoutHeader';

describe('Should show a ResponsiveLayoutHeader', () => {
  const Wrapper = ({ size }: { size: string }) => (
    <Grommet theme={theme}>
      <IntlProvider locale="en">
        <ResponsiveContext.Provider value={size}>
          <ResponsiveLayoutHeader />
        </ResponsiveContext.Provider>
      </IntlProvider>
    </Grommet>
  );

  it('display logo container', async () => {
    render(<Wrapper size={'large'} />, {
      wrapper: BrowserRouter,
    });
    screen.getByLabelText('logo-container');
  });
});
