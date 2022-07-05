import { WidthType } from 'grommet/utils';
import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useController } from '../../../controller';
import { RoomSettings } from '../../../types/room';
import { Toggle } from '../../design-system';

export interface RoomSettingToggleProps {
  label: string;
  settingKey: keyof RoomSettings;
  roomName: string;
  checked?: boolean;
  forceDisabled?: boolean;
  width?: WidthType;
}

const RoomSettingToggle = ({
  label,
  settingKey,
  roomName,
  checked,
  forceDisabled,
  width,
}: RoomSettingToggleProps) => {
  const controller = useController();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(controller.updateRoomSettings, {
    onSuccess: (data) => {
      queryClient.setQueryData(['room', { name: roomName }], data);
    },
  });

  return (
    <Toggle
      title={label}
      label={label}
      checked={checked}
      onChange={(event) =>
        mutate({ name: roomName, roomSettings: { [settingKey]: event.currentTarget.checked } })
      }
      disabled={forceDisabled || checked === undefined || isLoading}
      loading={checked === undefined || isLoading}
      variant="primary"
      width={width}
    />
  );
};

export default RoomSettingToggle;
