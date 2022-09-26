import { render, screen } from '@testing-library/react';
import { Add } from 'grommet-icons';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ResponsiveLayoutHeaderNavItem } from './ResponsiveLayoutHeaderNavItem';

describe('Should show a ResponsiveLayoutHeaderNavItem', () => {
  it('display ResponsiveLayoutHeaderNavItem', async () => {
    render(
      <ResponsiveLayoutHeaderNavItem
        icon={<Add aria-label={''} />}
        label={'Home'}
        route={'/account'}
      />,
      {
        wrapper: BrowserRouter,
      },
    );
    const link = screen.getByRole('link', { name: 'Home' });
    expect(link).toHaveAttribute('href', '/account');
    screen.getByLabelText('Home');
  });
});
