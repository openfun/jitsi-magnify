import { render, screen } from '@testing-library/react';
import React from 'react';
import LoadingButton from './LoadingButton';

describe('LoadingButton', () => {
  it('should render a non loading button and loading button with same style', () => {
    render(
      <>
        <LoadingButton isLoading primary label="Test" />
        <LoadingButton primary isLoading={false} label="Test" />
      </>,
    );

    const [buttonLoading, buttonNotLoading] = screen.getAllByText('Test');

    expect(buttonNotLoading).toBeEnabled();
    expect(buttonLoading).toBeEnabled();

    expect(buttonNotLoading.clientWidth).toBe(buttonLoading.clientWidth);
  });
});
