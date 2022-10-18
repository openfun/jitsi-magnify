import { render, screen } from '@testing-library/react';
import { AppsRounded } from 'grommet-icons';
import React from 'react';
import { MagnifyTestingProvider } from '../../../../app';
import { ResponsiveLayoutHeaderNavItemProps } from './NavItem/ResponsiveLayoutHeaderNavItem';
import { ResponsiveLayoutHeaderNav } from './ResponsiveLayoutHeaderNav';

describe('Should show a ResponsiveLayoutHeaderNav', () => {
  it('display ResponsiveLayoutHeaderNav', async () => {
    render(<ResponsiveLayoutHeaderNav />, {
      wrapper: MagnifyTestingProvider,
    });
    const navItems: ResponsiveLayoutHeaderNavItemProps[] = [
      {
        icon: <AppsRounded aria-label={''} color={'plain'} size={'18px'} />,
        label: 'Rooms',
        goToRoute: () => {},
      },
    ];
    const links = screen.getAllByRole('link');
    expect(links.length).toBe(1);
    navItems.map((item) => {
      screen.getByLabelText(item.label);
    });
  });
});
