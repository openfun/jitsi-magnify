import React from 'react';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import IdentityBlock from './IdentityBlock';

describe('IdentityBlock', () => {
  it('should render the avatar and identity forms with right default values', async () => {
    render(
      <IntlProvider locale="en">
        <IdentityBlock
          name="John Doe"
          username="johndoe3"
          email="john.doe@example.com"
          avatar="test.jpg"
        />
      </IntlProvider>,
    );

    const nameInput = screen.getByLabelText('Name');
    const usernameInput = screen.getByLabelText('Username');
    const emailInput = screen.getByLabelText('Email');
    const saveButton = screen.getByText('Save');

    expect(nameInput).toHaveValue('John Doe');
    expect(usernameInput).toHaveValue('johndoe3');
    expect(emailInput).toHaveValue('john.doe@example.com');
    expect(saveButton).toBeDisabled();

    const avatarImage = screen.getByTitle('Your avatar');
    expect(avatarImage).toHaveStyle('background-image: url(test.jpg)');
  });
});
