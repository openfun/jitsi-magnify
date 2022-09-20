import { render, screen } from '@testing-library/react';
import React from 'react';
import MagnifyCard from './MagnifyCard';

describe('MagnifyCard', () => {
  it('should render successfully a MagnifyCard', async () => {
    render(
      <MagnifyCard title={'Test'}>
        <div>Test body</div>
      </MagnifyCard>,
    );
    screen.getByRole('heading', { level: 3, name: 'Test' });
    screen.getByText('Test body');
  });
});
