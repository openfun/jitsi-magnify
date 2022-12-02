import React from 'react';
import { render, screen } from '../../../utils/test-utils';
import { PasswordUpdateBlock } from './PasswordUpdateBlock';

describe('PasswordUpdateBlock', () => {
  it('should render the form and an explanation', () => {
    render(<PasswordUpdateBlock />);

    // Verify we get the form
    screen.getByLabelText('Previous password') as HTMLInputElement;
    screen.getByLabelText('New password') as HTMLInputElement;
    screen.getByLabelText('Confirm new password') as HTMLInputElement;

    // Verify we get the explanation
    screen.getByText('Update password');
    screen.getByText(/choose a password with more than 8 characters/);
    screen.getByText(/mix of letters, numbers and symbols/);
  });
});
