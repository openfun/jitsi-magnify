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
});
