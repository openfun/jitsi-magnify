import { render, screen } from '@testing-library/react';
import React from 'react';
import { TestingContainer } from '../TestingContainer';
import Breadcrumbs from './Breadcrumbs';

describe('Breadcrumbs', () => {
  it('should render successfully a breadcrumbs', async () => {
    render(
      <TestingContainer>
        <Breadcrumbs />
      </TestingContainer>,
    );

    screen.getByRole('list');
    const items = screen.getAllByRole('listitem');
    expect(items.length).toBe(1);
    expect(items[0].textContent).toBe('Home');
  });
});
