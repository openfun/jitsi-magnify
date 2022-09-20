import { Box, Button, Card, Layer, Text } from 'grommet';
import { Add } from 'grommet-icons';
import React, { useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
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
        border={{ style: 'dashed', size: '2px', color: 'brand' }}
        direction="row"
        elevation="0"
        justify="between"
        margin={{ bottom: 'medium' }}
        pad="small"
      >
        <Text color="brand" margin={{ vertical: 'auto' }}>
          {intl.formatMessage(messages.registerNewRoomLabel)}
        </Text>
        <Button
          primary
          icon={<Add aria-label="Register new room" name="Register new room" size="20px" />}
          onClick={handleOpen}
          size="small"
          title="Register new room"
          type="button"
        />
      </Card>
      {open && (
        <Layer
          id="confirmDelete"
          onClickOutside={handleClose}
          onEsc={handleClose}
          position="center"
          role="dialog"
        >
          <Box pad="medium" width={'medium'}>
            <RegisterRoomForm onSuccess={handleClose} />
          </Box>
        </Layer>
      )}
    </>
  );
};

export default RegisterRoom;
