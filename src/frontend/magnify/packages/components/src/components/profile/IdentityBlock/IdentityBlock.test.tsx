import { screen } from '@testing-library/react';
import React from 'react';
import { renderWrappedInTestingProvider } from '../../../utils/test-utils';
import { IdentityBlock } from './IdentityBlock';

describe('IdentityBlock', () => {
  it('should render the avatar and identity forms with right default values', async () => {
    renderWrappedInTestingProvider(<IdentityBlock />);

    const nameInput = screen.getByLabelText('Name');
    const usernameInput = screen.getByLabelText('Username');
    const emailInput = screen.getByLabelText('Email');
    const saveButton = screen.getByText('Save');

    expect(nameInput).toHaveValue('John Doe');
    expect(usernameInput).toHaveValue('JohnDoe');
    expect(emailInput).toHaveValue('john.doe@gmail.com');
    expect(saveButton).toBeDisabled();
  });
});
