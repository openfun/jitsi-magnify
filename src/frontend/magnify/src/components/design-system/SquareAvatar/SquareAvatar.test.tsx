import { render, screen } from '@testing-library/react';
import React from 'react';
import SquareAvatar from './SquareAvatar';

describe('SquareAvatar', () => {
  it('should render a 40px avatar', () => {
    render(<SquareAvatar src="hello.jpg" title="me" />);
    const img = screen.getByTitle('me');
    expect(img).toHaveStyle("background-image: url('hello.jpg');");
  });

  it('should render a 40px avatar with a more icon', () => {
    render(<SquareAvatar more title="others" />);
    expect(screen.getByLabelText('More').tagName).toBe('svg');
    screen.getByTitle('others');
  });

  it('should render initials if title is provided but not src or more', () => {
    render(<SquareAvatar title="John Doe" />);
    expect(screen.getByText('JD')?.parentElement).toBe(screen.getByTitle('John Doe'));
  });
});
