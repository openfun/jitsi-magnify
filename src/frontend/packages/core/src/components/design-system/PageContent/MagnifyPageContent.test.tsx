import { Button } from '@openfun/cunningham-react';
import { screen } from '@testing-library/react';
import React from 'react';
import { renderWrappedInTestingProvider } from '../../../utils/test-utils';
import { MagnifyPageContent } from './MagnifyPageContent';

describe('MagnifyPageContent', () => {
  it('shouldRender a MagnifyPageContent with title, children and actionButton', async () => {
    renderWrappedInTestingProvider(
      <MagnifyPageContent actions={<Button>add room</Button>} title={'Rooms'}>
        <div>Hello !</div>
      </MagnifyPageContent>,
    );
    screen.getByRole('button', { name: 'add room' });
    screen.getByRole('heading', { level: 3, name: 'Rooms' });
    screen.getByText('Hello !');
  });
});
