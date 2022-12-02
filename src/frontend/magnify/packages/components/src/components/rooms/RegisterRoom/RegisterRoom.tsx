import { Box, Button, Layer } from 'grommet';
import { Add } from 'grommet-icons';
import React, { useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { Room } from '../../../types/entities/room';
import { RegisterRoomForm } from '../RegisterRoomForm';

const messages = defineMessages({
  registerNewRoomLabel: {
    id: 'components.rooms.registerRoom.registerNewRoomLabel',
    defaultMessage: 'Register new room',
    description: 'Label for the button to register a new room',
  },
  addNewRoomLabel: {
    id: 'components.rooms.registerRoom.addNewRoomLabel',
    defaultMessage: 'Room',
    description: 'Label for the button to register a new room',
  },
});

export interface RegisterRoomProps {
  onAddRoom?: (room: Room) => void;
}

export const RegisterRoom = ({ ...props }: RegisterRoomProps) => {
  const intl = useIntl();
  const [open, setOpen] = useState(false);

  const handleOpen = (event: React.MouseEvent) => {
    event.preventDefault();
    setOpen(true);
  };

  const handleClose = (event?: React.MouseEvent | React.KeyboardEvent) => {
    event?.preventDefault();
    setOpen(false);
  };

  const onAddSuccess = (room?: Room): void => {
    handleClose();
  };

  return (
    <>
      <Button
        primary
        icon={<Add size="15px" />}
        label={intl.formatMessage(messages.addNewRoomLabel)}
        onClick={handleOpen}
      />
      {open && (
        <Layer
          id="confirmDelete"
          onClickOutside={handleClose}
          onEsc={handleClose}
          position="center"
          role="dialog"
        >
          <Box pad="medium" width={'medium'}>
            <RegisterRoomForm onSuccess={onAddSuccess} />
          </Box>
        </Layer>
      )}
    </>
  );
};
