import { defineMessages, useIntl } from 'react-intl';
import React, { useState } from 'react';
import { Box, Button, Card, Layer, Text } from 'grommet';
import { Add } from 'grommet-icons';
import RegisterRoomForm from '../RegisterRoomForm';

const messages = defineMessages({
  registerNewRoomLabel: {
    id: 'components.rooms.registerRoom.registerNewRoomLabel',
    defaultMessage: 'Register new room',
    description: 'Label for the button to register a new room',
  },
});

const RegisterRoom = () => {
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

  return (
    <>
      <Card
        elevation="0"
        border={{ style: 'dashed', size: '2px', color: 'brand' }}
        pad="small"
        margin={{ bottom: 'medium' }}
        direction="row"
        justify="between"
      >
        <Text color="brand" margin={{ vertical: 'auto' }}>
          {intl.formatMessage(messages.registerNewRoomLabel)}
        </Text>
        <Button
          primary
          onClick={handleOpen}
          type="button"
          icon={<Add size="20px" name="Register new room" aria-label="Register new room" />}
          size="small"
          title="Register new room"
        />
      </Card>
      {open && (
        <Layer
          id="confirmDelete"
          position="center"
          onClickOutside={handleClose}
          onEsc={handleClose}
          role="dialog"
        >
          <Box width={'medium'} pad="medium">
            <RegisterRoomForm onSuccess={handleClose} />
          </Box>
        </Layer>
      )}
    </>
  );
};

export default RegisterRoom;
