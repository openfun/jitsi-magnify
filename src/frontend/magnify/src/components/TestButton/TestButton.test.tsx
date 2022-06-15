import React from 'react';
import { IntlProvider } from 'react-intl';
import TestButton, { TestButtonVariant } from './TestButton';
import { render, screen } from '@testing-library/react';

describe('TestButton', () => {
  it('renders the test button in red when variant is red', () => {
    render(
      <IntlProvider locale="en">
        <TestButton variant={TestButtonVariant.RED} />
      </IntlProvider>,
    );
    const testButton = screen.getByRole('button', { name: 'Test Button' });
    expect(testButton).toHaveStyle({ backgroundColor: 'red' });
  });

  it('renders the test button in blue when variant is blue', () => {
    render(
      <IntlProvider locale="en">
        <TestButton variant={TestButtonVariant.BLUE} />
      </IntlProvider>,
    );
    const testButton = screen.getByRole('button', { name: 'Test Button' });
    expect(testButton).toHaveStyle({ backgroundColor: 'blue' });
  });
});
