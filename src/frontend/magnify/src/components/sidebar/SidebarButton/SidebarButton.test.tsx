import { fireEvent, render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter, Router } from 'react-router-dom';

import SidebarButton from './SidebarButton';

describe('SidebarButton', () => {
  it('should render with correct label', () => {
    render(
      <IntlProvider locale="en">
        <MemoryRouter>
          <SidebarButton label="Test Button" navigateTo="test" />
        </MemoryRouter>
      </IntlProvider>,
    );

    const button = screen.getByRole('link');
    expect(button).toHaveTextContent('Test Button');
  });

  it('should redirect to a path when clicked', () => {
    const history = createMemoryHistory();
    history.push('/');

    render(
      <IntlProvider locale="en">
        <Router location={history.location} navigator={history}>
          <SidebarButton label="Test Button" navigateTo="test" />
        </Router>
      </IntlProvider>,
    );

    const button = screen.getByRole('link', { name: 'Test Button' });
    expect(button).toHaveAttribute('href', '/test');
    fireEvent.click(button);
    expect(history.location.pathname).toBe('/test');
  });

  it('should be transparent when location does not match its path', () => {
    const history = createMemoryHistory();
    history.push('/any/path');

    render(
      <IntlProvider locale="en">
        <Router location={history.location} navigator={history}>
          <SidebarButton label="Test Button" navigateTo="test" />
        </Router>
      </IntlProvider>,
    );

    const button = screen.getByRole('link', { name: 'Test Button' });
    expect(button).toHaveStyle('background-color: transparent');
  });

  it('should be colored when location root matches its given path', async () => {
    const history = createMemoryHistory();
    history.push('/test/any');

    render(
      <IntlProvider locale="en">
        <Router location={history.location} navigator={history}>
          <SidebarButton label="Test Button" navigateTo="test" />
        </Router>
      </IntlProvider>,
    );

    const button = screen.getByRole('link', { name: 'Test Button' });
    expect(button).not.toHaveStyle('background-color: transparent');
  });
});
