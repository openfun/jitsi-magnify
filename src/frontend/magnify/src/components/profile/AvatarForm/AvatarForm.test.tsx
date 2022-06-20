import React from 'react';
import { render, screen } from '@testing-library/react';
import AvatarForm from './AvatarForm';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl';

describe('AvatarForm', () => {
  it('should render the default avatar, and when a new one is loaded, it should display it as preview', async () => {
    const user = userEvent.setup();
    render(
      <IntlProvider locale="en">
        <AvatarForm src="test.jpg" />
      </IntlProvider>,
    );

    // Verify the default layout
    const uploadLabel = screen.getByText('Load new avatar');
    const avatarImage = screen.getByTitle('Your avatar');
    expect(avatarImage).toHaveStyle('background-image: url(test.jpg)');

    // Import a new file
    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    await user.upload(uploadLabel.parentElement as HTMLElement, file);

    // Verify the new layout: it should be a new save button, a new image, and a new remove button
    await screen.findByText('Save');
    await screen.findByLabelText('Remove avatar');
    expect(avatarImage).toHaveStyle('background-image: url(data:image/png;base64,aGVsbG8=)');
  });
});
