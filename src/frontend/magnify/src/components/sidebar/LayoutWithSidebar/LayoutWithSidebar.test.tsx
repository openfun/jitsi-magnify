import React from 'react';
import { IntlProvider } from 'react-intl';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LayoutWithSidebar from './LayoutWithSidebar';

describe('LayoutWithSidebar', () => {
  it('should render its children', () => {
    render(
      <IntlProvider locale="en">
        <MemoryRouter>
          <LayoutWithSidebar>
            <div>Test Text</div>
          </LayoutWithSidebar>
        </MemoryRouter>
      </IntlProvider>,
    );
    const content = screen.getByText('Test Text');
    expect(content).toBeVisible();
  });
});
