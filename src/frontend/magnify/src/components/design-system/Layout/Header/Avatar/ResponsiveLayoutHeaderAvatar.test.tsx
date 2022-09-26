import { render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ResponsiveLayoutHeaderAvatar } from './ResponsiveLayoutHeaderAvatar';

describe('Should show a ResponsiveLayoutHeaderAvatar', () => {
  it('display ResponsiveLayoutHeaderAvatar', async () => {
    render(<ResponsiveLayoutHeaderAvatar />, {
      wrapper: BrowserRouter,
    });
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/account');
    screen.getByText('NP');
  });
});
