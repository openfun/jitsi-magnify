import { Box, Button, Layer } from 'grommet';
import { Add } from 'grommet-icons';
import React, { useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { Meeting } from '../../../types/entities/meeting';
import RegisterMeetingForm from '../RegisterMeetingForm';

const messages = defineMessages({
  registerNewMeetingLabel: {
    id: 'components.meetings.registerMeeting.registerNewMeetingLabel',
    defaultMessage: 'Register new meeting',
    description: 'Label for the button to register a new meeting',
  },
  addNewMeetingLabel: {
    id: 'components.meetings.registerMeeting.addNewMeetingLabel',
    defaultMessage: 'Meeting',
    description: 'Label for the button to register a new meeting',
  },
});

export interface RegisterMeetingProps {
  onAddMeeting?: (meeting: Meeting) => void;
}

const RegisterMeeting = ({ ...props }: RegisterMeetingProps) => {
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

  const onAddSuccess = (meeting?: Meeting): void => {
    handleClose();
  };

  return (
    <>
      <Button
        primary
        icon={<Add size="15px" />}
        label={intl.formatMessage(messages.addNewMeetingLabel)}
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
            <RegisterMeetingForm onSuccess={onAddSuccess} />
          </Box>
        </Layer>
      )}
    </>
  );
};

export default RegisterMeeting;
