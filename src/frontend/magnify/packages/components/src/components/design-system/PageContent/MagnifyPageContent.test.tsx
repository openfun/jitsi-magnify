import { Button } from 'grommet';
import React from 'react';
import { render, screen } from '../../../utils/test-utils';
import { MagnifyPageContent } from './MagnifyPageContent';

describe('MagnifyPageContent', () => {
  it('shouldRender a MagnifyPageContent with title, children and actionButton', async () => {
    render(
      <MagnifyPageContent actions={<Button label={'add room'} />} title={'Rooms'}>
        <div>Hello !</div>
      </MagnifyPageContent>,
    );
    screen.getByRole('button', { name: 'add room' });
    screen.getByRole('heading', { level: 3, name: 'Rooms' });
    screen.getByText('Hello !');
  });
});
