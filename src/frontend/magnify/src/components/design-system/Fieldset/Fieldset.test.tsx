import { render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import Fieldset from './Fieldset';

describe('Fieldset', () => {
  it('should render successfully a fieldset-like div with a label', () => {
    render(
      <IntlProvider locale="en">
        <Fieldset
          required
          displayErrors={true}
          errors={['error1', 'error2']}
          label="test label"
          margin="small"
          name="test input"
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
