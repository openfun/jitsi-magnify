import { render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { navItems, ResponsiveLayoutHeaderNav } from './ResponsiveLayoutHeaderNav';

describe('Should show a ResponsiveLayoutHeaderNav', () => {
  it('display ResponsiveLayoutHeaderNav', async () => {
    render(<ResponsiveLayoutHeaderNav />, {
      wrapper: BrowserRouter,
    });
    const links = screen.getAllByRole('link');
    expect(links.length).toBe(1);
    navItems.map((item) => {
      const link = screen.getByRole('link', { name: item.label });
      expect(link).toHaveAttribute('href', item.route);
      screen.getByLabelText(item.label);
    });
  });
});
