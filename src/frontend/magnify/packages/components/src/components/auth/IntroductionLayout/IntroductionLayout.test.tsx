import { act, screen } from '@testing-library/react';
import { ResponsiveContext } from 'grommet';
import React from 'react';
import { renderWrappedInTestingProvider } from '../../../utils/test-utils';
import { IntroductionLayout } from '../index';

describe('Introduction Layout', () => {
  it('should render the signup form by default', async () => {
    await act(async () => {
      renderWrappedInTestingProvider(
        <ResponsiveContext.Provider value={'large'}>
          <IntroductionLayout background="light-2" urlCover="cover.png" urlLogo="logo.png">
            <div>Hello !</div>
          </IntroductionLayout>
        </ResponsiveContext.Provider>,
      );
    });

    screen.getByText('Hello !');
    expect(screen.getByAltText('logo')).toHaveAttribute('src', 'logo.png');
    expect(screen.getByAltText('illustration')).toHaveAttribute('src', 'cover.png');
  });
});
