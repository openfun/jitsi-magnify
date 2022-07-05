import React from 'react';
import { IntlProvider } from 'react-intl';
import WaitingRow from './WaitingRow';
import { render, screen } from '@testing-library/react';

describe('WaitingRow', () => {
  it('should render successfully', () => {
    render(
      <IntlProvider locale="en">
        <WaitingRow />
      </IntlProvider>,
    );
  });
});
