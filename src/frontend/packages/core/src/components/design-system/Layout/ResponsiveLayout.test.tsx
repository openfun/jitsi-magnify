import { render, screen } from '@testing-library/react';
import React from 'react';
import { MagnifyTestingProvider } from '../../app';
import { ResponsiveLayout } from './ResponsiveLayout';

describe('Should show a ResponsiveLayout', () => {
  it('display ResponsiveLayout', async () => {
    render(
      <ResponsiveLayout>
        <div>Hello !</div>
      </ResponsiveLayout>,
      {
        wrapper: MagnifyTestingProvider,
      },
    );
    screen.getByText('Hello !');
  });
});
