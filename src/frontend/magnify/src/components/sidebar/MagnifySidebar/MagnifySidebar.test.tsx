import { render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import MagnifySidebar from './MagnifySidebar';

describe('MagnifySidebar', () => {
  it('should provide a navbar', () => {
    render(
      <IntlProvider locale="en">
        <MemoryRouter>
          <MagnifySidebar />
        </MemoryRouter>
      </IntlProvider>,
    );
    const navbar = screen.getByRole('navigation');
    expect(navbar).toBeInTheDocument();
  });

  it('should render buttons', () => {
    render(
      <IntlProvider locale="en">
        <MemoryRouter>
          <MagnifySidebar
            itemZones={[
              [
                { label: 'ButtonA', navigateTo: 'a' },
                { label: 'ButtonB', navigateTo: 'b' },
              ],
              [{ label: 'ButtonC', navigateTo: 'c' }],
            ]}
          />
        </MemoryRouter>
      </IntlProvider>,
    );

    const buttonA = screen.getByRole('link', { name: 'ButtonA' });
    expect(buttonA).toBeInTheDocument();
    const buttonB = screen.getByRole('link', { name: 'ButtonB' });
    expect(buttonB).toBeInTheDocument();
    const buttonC = screen.getByRole('link', { name: 'ButtonC' });
    expect(buttonC).toBeInTheDocument();
  });

  it('should render a header if provided', () => {
    render(
      <IntlProvider locale="en">
        <MemoryRouter>
          <MagnifySidebar
            header={<h1>Header</h1>}
            itemZones={[[{ label: 'ButtonA', navigateTo: 'a' }]]}
          />
        </MemoryRouter>
      </IntlProvider>,
    );

    const header = screen.getByRole('heading', { name: 'Header' });
    expect(header).toBeInTheDocument();
  });

  it('should render a footer if provided', () => {
    render(
      <IntlProvider locale="en">
        <MemoryRouter>
          <MagnifySidebar
            footer={<a href="/">Footer</a>}
            itemZones={[[{ label: 'ButtonA', navigateTo: 'a' }]]}
          />
        </MemoryRouter>
      </IntlProvider>,
    );

    const footer = screen.getByRole('link', { name: 'Footer' });
    expect(footer).toBeInTheDocument();
  });
});
