import { screen } from '@testing-library/react';
import { Button } from 'grommet';
import React from 'react';
import { renderWrappedInTestingProvider } from '../../../utils/test-utils';
import { MagnifyPageContent } from './MagnifyPageContent';

describe('MagnifyPageContent', () => {
  it('shouldRender a MagnifyPageContent with title, children and actionButton', async () => {
    renderWrappedInTestingProvider(
      <MagnifyPageContent actions={<Button label={'add room'} />} title={'Rooms'}>
        <div>Hello !</div>
      </MagnifyPageContent>,
    );
    screen.getByRole('button', { name: 'add room' });
    screen.getByRole('heading', { level: 3, name: 'Rooms' });
    screen.getByText('Hello !');
  });
});
