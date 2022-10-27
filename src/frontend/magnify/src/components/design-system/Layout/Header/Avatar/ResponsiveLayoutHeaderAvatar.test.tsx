import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { commonMessages } from '../../../../../i18n/Messages/commonMessages';
import { MagnifyTestingProvider } from '../../../../app';
import { ResponsiveLayoutHeaderAvatar } from './ResponsiveLayoutHeaderAvatar';

describe('Should show a ResponsiveLayoutHeaderAvatar', () => {
  it('display ResponsiveLayoutHeaderAvatar', async () => {
    render(<ResponsiveLayoutHeaderAvatar />, {
      wrapper: MagnifyTestingProvider,
    });
    const button = screen.getByRole('button', { name: 'Open Menu' });

    fireEvent.click(button);
    screen.getByText(commonMessages.account.defaultMessage);
    screen.getByText(commonMessages.logout.defaultMessage);
    screen.getByText('JD');
  });
});
