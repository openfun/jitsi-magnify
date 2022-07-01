import { render, screen } from '@testing-library/react';
import { Grommet } from 'grommet';
import React from 'react';
import { IntlProvider } from 'react-intl';
import Section from './Section';

describe('Section', () => {
  it('should render its children', () => {
    render(
      <Grommet>
        <IntlProvider locale="en">
          <Section>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Section>
        </IntlProvider>
      </Grommet>,
    );

    expect(
      screen.getByText('Lorem ipsum dolor sit amet, consectetur adipiscing elit.'),
    ).toBeInTheDocument();
  });

  it('should render a title', () => {
    render(
      <IntlProvider locale="en">
        <Section title="Section Title">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Section>
      </IntlProvider>,
    );

    expect(screen.getByRole('heading', { name: 'Section Title' })).toBeInTheDocument();
  });
});
