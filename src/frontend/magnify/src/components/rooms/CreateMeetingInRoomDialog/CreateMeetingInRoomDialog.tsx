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
      id="confirmDelete"
      position="center"
      onClickOutside={onClose}
      onEsc={onClose}
      role="dialog"
      modal
    >
      <Box pad="medium" width="large" overflow={'auto'}>
        <CreateMeetingForm roomSlug={roomSlug} onCancel={onClose} onSuccess={onClose} />
      </Box>
    </Layer>
  );
};

export default CreateMeetingInRoomDialog;
