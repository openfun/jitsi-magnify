import { useQuery } from '@tanstack/react-query';
import { Box, Spinner } from 'grommet';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { MagnifyMeeting } from '../../../components';
import { RoomsRepository } from '../../../services';
import { defaultConfiguration } from '../../../types';
import { MagnifyQueryKeys } from '../../../utils';

export const RoomsJitsiView = () => {
  const { id } = useParams();

  const { data: room, isLoading } = useQuery([MagnifyQueryKeys.ROOM, id], () => {
    return RoomsRepository.get(id);
  });

  if (room && room.jitsi?.token == null) {
    return <>Room Privé, connectez vous</>;
  }

  return (
    <Box
      align="center"
      background="white"
      justify="center"
      style={{
        zIndex: 10,
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
      }}
    >
      {room && (
        <Box width="100%">
          <MagnifyMeeting
            configuration={room?.configuration ?? defaultConfiguration}
            jwt={room.jitsi.token}
            roomDisplayName={room.name}
            roomName={room.jitsi.room}
          />
        </Box>
      )}
      {!room && isLoading && <Spinner />}
    </Box>
  );
};
