import React from 'react';
import { render, screen } from '../../../utils/test-utils';
import MyRooms from './MyRooms';

describe('MyRooms', () => {
  it('should render successfully', async () => {
    render(
      <MyRooms
        baseJitsiUrl=""
        rooms={[{ id: 'Test', slug: 'room-test', name: 'Room Test', is_administrable: true }]}
      />,
    );

    // 3) Check the rooms
    expect(screen.getAllByRole('button', { name: 'Join' }).length).toBe(1);
  });
});
