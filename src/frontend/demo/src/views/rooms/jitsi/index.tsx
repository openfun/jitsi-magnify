import {
  defaultConfiguration,
  MagnifyMeeting,
  MagnifyQueryKeys,
  RoomsRepository,
} from '@jitsi-magnify/core';
import { useQuery } from '@tanstack/react-query';
import { Box, Spinner } from 'grommet';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { DefaultPage } from '../../../components/DefaultPage';

export function RoomsJitsiView() {
  const { id } = useParams();

  const { data: room, isLoading } = useQuery([MagnifyQueryKeys.ROOM, id], () => {
    return RoomsRepository.get(id, false);
  });

  return (
    <DefaultPage>
      <Box
        align={'center'}
        background={'white'}
        justify={'center'}
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
          <Box width={'100%'}>
            <MagnifyMeeting
              configuration={room.configuration ?? defaultConfiguration}
              jwt={room.jitsi.token}
              roomName={room.jitsi.room}
            />
          </Box>
        )}
        {!room && isLoading && <Spinner />}
      </Box>
    </DefaultPage>
  );
}
