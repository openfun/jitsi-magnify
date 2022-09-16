import { Box, Layer } from 'grommet';
import React from 'react';

import { CreateMeetingForm } from '../../meetings';

export interface CreateMeetingInRoomDialogProps {
  open: boolean;
  onClose: () => void;
  roomSlug: string;
}

const CreateMeetingInRoomDialog = ({ open, onClose, roomSlug }: CreateMeetingInRoomDialogProps) => {
  if (!open) return null;
  return (
    <Layer
      modal
      id="confirmDelete"
      onClickOutside={onClose}
      onEsc={onClose}
      position="center"
      role="dialog"
    >
      <Box overflow="auto" pad="medium" width="large">
        <CreateMeetingForm onCancel={onClose} onSuccess={onClose} roomSlug={roomSlug} />
      </Box>
    </Layer>
  );
};

export default CreateMeetingInRoomDialog;
