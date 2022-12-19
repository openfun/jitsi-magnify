import { ButtonExtendedProps, Select, Text } from 'grommet';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useIsSmallSize } from '../../../../../hooks/useIsMobile';
import { commonMessages } from '../../../../../i18n/Messages/commonMessages';
import { commonRoomMessages } from '../../../../../i18n/Messages/Room/commonRoomMessages';
import { RoomAccessRole, RoomUser } from '../../../../../types';
import { Maybe } from '../../../../../types/misc';
import { UserRowBase, UserRowBaseProps } from '../../../../users/row/base';

interface RoomUsersConfigRowProps extends UserRowBaseProps<RoomUser> {
  onUpdateRole: (newRole: RoomAccessRole) => void;
  onDelete: () => void;
  role: RoomAccessRole;
  canUpdate: boolean;
  options?: ButtonExtendedProps[];
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

  const getDefaultOptions = () => {
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
        <Text margin={'0 5px'} size="small">
          {props.role}
        </Text>
      );
    }
    return (
      <Select
        plain
        defaultValue={RoomAccessRole.OWNER}
        disabledKey="disabled"
        onChange={({ option }) => props.onUpdateRole(option.value)}
        options={props.options ?? getDefaultOptions()}
        size="small"
        value={props.role}
        valueKey={{ key: 'value', reduce: true }}
        width="50%"
        style={{
          border: 'none !important',
          padding: '5px',
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
