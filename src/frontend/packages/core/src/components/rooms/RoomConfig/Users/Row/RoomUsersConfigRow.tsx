import { Select } from '@openfun/cunningham-react';
import { ButtonExtendedProps, Text } from 'grommet';

import * as React from 'react';
import { useIntl } from 'react-intl';
import { useIsSmallSize } from '../../../../../hooks/useIsMobile';
import { commonMessages } from '../../../../../i18n/Messages/commonMessages';
import { commonRoomMessages } from '../../../../../i18n/Messages/Room/commonRoomMessages';
import { RoomAccessRole, RoomUser } from '../../../../../types';
import { Maybe, SelectOption } from '../../../../../types/misc';
import { UserRowBase, UserRowBaseProps } from '../../../../users/row/base';

interface RoomUsersConfigRowProps extends UserRowBaseProps<RoomUser> {
  onUpdateRole: (newRole: RoomAccessRole) => void;
  onDelete: () => void;
  role: RoomAccessRole;
  canUpdate: boolean;
  options?: SelectOption[];
}

export const RoomUsersConfigRow = ({ ...props }: RoomUsersConfigRowProps) => {
  const intl = useIntl();
  const isSmallScreen = useIsSmallSize();

  const getUserMoreActions = (): Maybe<ButtonExtendedProps[]> => {
    if (props.role === RoomAccessRole.OWNER) {
      return undefined;
    }
    return [
      {
        label: intl.formatMessage(commonMessages.delete),
        onClick: props.onDelete,
      },
    ];
  };

  const getDefaultOptions = (): { value: RoomAccessRole; label: string }[] => {
    return [
      {
        value: RoomAccessRole.OWNER,
        label: intl.formatMessage(commonRoomMessages.role_owner),
      },
      {
        value: RoomAccessRole.ADMINISTRATOR,
        label: intl.formatMessage(commonRoomMessages.role_administrator),
      },
      {
        value: RoomAccessRole.MEMBER,
        label: intl.formatMessage(commonRoomMessages.role_member),
      },
    ];
  };

  const getRightContent = (): React.ReactNode => {
    if (isSmallScreen) {
      return null;
    }
    if (!props.canUpdate) {
      return (
        <Text margin="0 5px" size="small">
          {props.role}
        </Text>
      );
    }
    return (
      <Select
        clearable={false}
        defaultValue={props.role ?? RoomAccessRole.OWNER}
        disabled={!props.canUpdate || (props.options && props.options.length === 0)}
        hideLabel={true}
        label={intl.formatMessage(commonRoomMessages.roleLabel)}
        options={props.options && props.options.length > 0 ? props.options : getDefaultOptions()}
        onChange={(e) => {
          if (!e.target.value) {
            return;
          }
          props.onUpdateRole(e.target.value as RoomAccessRole);
        }}
      />
    );
  };

  return (
    <UserRowBase
      {...props}
      moreActions={getUserMoreActions()}
      rightContent={getRightContent()}
      showActions={props.canUpdate}
    />
  );
};
