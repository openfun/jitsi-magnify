import { screen } from '@testing-library/react';
import React from 'react';
import { renderWrappedInTestingProvider } from '../../../utils/test-utils';
import { InstantRoom } from './index';

describe('InstantRoom', () => {
  it('renders', async () => {
    renderWrappedInTestingProvider(<InstantRoom />);
    screen.getByRole('button', { name: 'Start' });
    screen.getByRole('textbox', { name: 'Room name' });
  });
});
