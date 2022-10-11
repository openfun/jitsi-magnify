import React from 'react';
import { render, screen } from '../../../utils/test-utils';
import ResponsiveLayout from '../Layout';
import Breadcrumbs from './Breadcrumbs';

describe('Breadcrumbs', () => {
  it('should render successfully a breadcrumbs', async () => {
    render(
      <ResponsiveLayout>
        <Breadcrumbs />
      </ResponsiveLayout>,
    );

    screen.getByRole('list');
    const items = screen.getAllByRole('listitem');
    expect(items.length).toBe(1);
    expect(items[0].textContent).toBe('Home');
  });
});
