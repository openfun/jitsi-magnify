import React from 'react';
import { IntlProvider } from 'react-intl';
import Fieldset from './Fieldset';
import { render, screen } from '@testing-library/react';

describe('Fieldset', () => {
  it('should render successfully a fieldset-like div with a label', () => {
    render(
      <IntlProvider locale="en">
        <Fieldset
          name="test input"
          label="test label"
          margin="small"
          errors={['error1', 'error2']}
          displayErrors={true}
          required
        >
          Hello
        </Fieldset>
      </IntlProvider>,
    );

    screen.getByText('test label');
    screen.getByText('*');
    screen.getByText('Hello');
    screen.getByText('error1, error2');
  });
});
