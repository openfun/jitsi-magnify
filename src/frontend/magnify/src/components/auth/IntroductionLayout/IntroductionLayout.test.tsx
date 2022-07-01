import { render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ControllerProvider, MockController } from '../../../controller';
import IntroductionLayout from './IntroductionLayout';

describe('Introduction Layout', () => {
  it('should render the signup form by default', () => {
    render(
      <ControllerProvider controller={new MockController()}>
        <QueryClientProvider client={new QueryClient()}>
          <IntlProvider locale="en">
            <IntroductionLayout background="light-2" urlCover="cover.png" urlLogo="logo.png" />
          </IntlProvider>
        </QueryClientProvider>
      </ControllerProvider>,
    );

    screen.getByText('Create an account');
    expect(screen.getByAltText('logo')).toHaveAttribute('src', 'logo.png');
    expect(screen.getByAltText('illustration')).toHaveAttribute('src', 'cover.png');
  });
});
