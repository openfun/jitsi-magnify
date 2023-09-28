import { render, screen } from '@testing-library/react';
import { Add } from 'grommet-icons';
import React from 'react';
import { MagnifyTestingProvider } from '../../../../../app';
import { ResponsiveLayoutHeaderNavItem } from './ResponsiveLayoutHeaderNavItem';

describe('Should show a ResponsiveLayoutHeaderNavItem', () => {
  it('display ResponsiveLayoutHeaderNavItem', async () => {
    render(<ResponsiveLayoutHeaderNavItem icon={<Add aria-label="" />} label="Home" />, {
      wrapper: MagnifyTestingProvider,
    });

    screen.getByLabelText('Home');
  });
});
