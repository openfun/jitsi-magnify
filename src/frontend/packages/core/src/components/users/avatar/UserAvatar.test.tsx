import { screen } from '@testing-library/react';
import React from 'react';
import { describe, it } from 'vitest';
import { renderWrappedInTestingProvider } from '../../../utils/test-utils';
import { UserAvatar } from './UserAvatar';

describe('UserAvatar', () => {
  it('should render successfully with username', async () => {
    renderWrappedInTestingProvider(<UserAvatar username={'JohnDoe'} />);
    await screen.findByText('J');
  });

  it('should render successfully with username', async () => {
    renderWrappedInTestingProvider(<UserAvatar username={'     JohnDoe      '} />);
    await screen.findByText('J');
  });

  it('should render successfully with username', async () => {
    renderWrappedInTestingProvider(<UserAvatar username={'     JohnDoe     Doe '} />);
    await screen.findByText('J');
  });

  it('should render successfully with name', async () => {
    renderWrappedInTestingProvider(<UserAvatar name={'John Doe'} username={'DoeJohn'} />);
    await screen.findByText('JD');
  });
  it('should render successfully with name', async () => {
    renderWrappedInTestingProvider(
      <UserAvatar name={'John Doe John Doe John Doe'} username={'DoeJohn'} />,
    );
    await screen.findByText('JD');
  });
  it('should render successfully with long spacing name', async () => {
    renderWrappedInTestingProvider(<UserAvatar name={'John          Doe'} username={'DoeJohn'} />);
    await screen.findByText('JD');
  });
  it('should render successfully with long spacing name', async () => {
    renderWrappedInTestingProvider(
      <UserAvatar name={'    John          Doe       '} username={'DoeJohn'} />,
    );
    await screen.findByText('JD');
  });
});
