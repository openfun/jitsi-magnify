import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import TextField from './TextField';

describe('TextField', () => {
  it('should follow the user typing', async () => {
    const user = userEvent.setup();
    const TestElement = () => {
      const [value, setValue] = React.useState('Hello');
      return (
        <TextField
          label="My input"
          name="my-input"
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
      );
    };

    render(<TestElement />);

    const input = screen.getByLabelText('My input') as HTMLInputElement;

    await user.type(input, ' World');
    expect(input.value).toBe('Hello World');
  });

  it('should apply the margin to the external box', () => {
    const { baseElement } = render(
      <TextField label="My input" name="my-input" onChange={() => {}} value="" margin="large" />,
    );
    expect(baseElement).toHaveStyle('margin: 8px');
  });

  it('should render the error messages', () => {
    render(
      <TextField
        label="My input"
        name="my-input"
        onChange={() => {}}
        value=""
        errors={['This is an error', 'This is another error']}
      />,
    );

    screen.getByText('This is an error, This is another error');
  });
});
