import { render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import WaitingRow from './WaitingRow';

describe('WaitingRow', () => {
  it('should render successfully', () => {
    render(
      <IntlProvider locale="en">
        <WaitingRow />
      </IntlProvider>,
    );

    screen.getByTitle('Loading...');
  });
});
