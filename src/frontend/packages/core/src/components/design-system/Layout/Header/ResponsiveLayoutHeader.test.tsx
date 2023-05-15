import { render, screen } from '@testing-library/react';
import React from 'react';
import { MagnifyTestingProvider } from '../../../app';
import { ResponsiveLayoutHeader } from './ResponsiveLayoutHeader';

describe('Should show a ResponsiveLayoutHeader', () => {
  it('display logo container', async () => {
    render(<ResponsiveLayoutHeader />, {
      wrapper: MagnifyTestingProvider,
    });
    screen.getByLabelText('logo-container');
  });
});
