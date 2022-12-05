import React from 'react';
import createRandomRoom from '../../../factories/rooms';
import { render, screen } from '../../../utils/test-utils';
import { MyRooms } from './MyRooms';

describe('MyRooms', () => {
  it('should render successfully', async () => {
    const rooms = [createRandomRoom()];
    render(<MyRooms baseJitsiUrl="" rooms={rooms} />);

    // 3) Check the rooms
    expect(screen.getAllByRole('button', { name: 'Join' }).length).toBe(1);
  });
  it('should display message when rooms list is emty', async () => {
    render(<MyRooms baseJitsiUrl="" rooms={[]} />);
    await screen.findByText(
      'No room was created yet. Click on the button " + Room" to create one.',
    );
  });
});
