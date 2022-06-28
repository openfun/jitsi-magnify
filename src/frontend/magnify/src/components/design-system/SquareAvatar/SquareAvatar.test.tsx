import { render, screen } from '@testing-library/react';
import React from 'react';
import SquareAvatar from './SquareAvatar';

describe('SquareAvatar', () => {
  it('should render a 40px avatar', async () => {
    render(<SquareAvatar src="hello.jpg" title="me" />);
    const img = screen.getByTitle('me');
    expect(img).toHaveStyle("background-image: url('hello.jpg');");
  });

  it('should render a 40px avatar with a more icon', async () => {
    render(<SquareAvatar title="others" more />);
    expect(screen.getByLabelText('More').tagName).toBe('svg');
    screen.getByTitle('others');
  });
});
