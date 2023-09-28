import { Box, BoxProps, CheckBox, Menu, Text } from 'grommet';
import { ButtonExtendedProps } from 'grommet/components/Button';
import { MoreVertical } from 'grommet-icons';
import * as React from 'react';
import { UserAvatar } from '../../avatar';

interface RowUserType {
  username: string;
  name: string;
}

export interface UserRowBaseProps<T extends RowUserType> extends BoxProps {
  user: T;
  isSelected?: boolean;
  showSelect?: boolean;
  onToggle?: () => void;
  onClick?: (user: T) => void;
  rightContent?: React.ReactNode;
  moreActions?: ButtonExtendedProps[];
  showActions?: boolean;
  style?: React.CSSProperties;
  className?: string;
  id?: string;
}

export const UserRowBase = <T extends RowUserType>({
  user,
  showActions = true,
  ...props
}: UserRowBaseProps<T>) => {
  return (
    <Box
      align="center"
      background="light-2"
      className={props.className}
      direction="row"
      id={props?.id}
      justify="between"
      onClick={() => props.onClick?.(user)}
      pad="xsmall"
      style={{ ...props.style, borderRadius: '8px' }}
      width="100%"
    >
      <Box align="center" direction="row" gap="small" justify="between">
        {props?.showSelect && (
          <Box background="white">
            <CheckBox checked={props.isSelected} onChange={props.onToggle} role="checkbox" />
          </Box>
        )}

        <UserAvatar name={user.name} username={user.username} />
        <Box align="start" direction="column" justify="center">
          <Text color="text-strong" size="small" weight="bold">
            {user?.name}
          </Text>
          <Text color="text-xweak" size="xsmall">
            {user?.username}
          </Text>
        </Box>
      </Box>
      <Box align="center" direction="row" gap="small">
        {props.rightContent}
        {showActions &&
          (props.moreActions && props.moreActions.length > 0 ? (
            <Menu
              dropProps={{ stretch: false, align: { top: 'top', right: 'right' } }}
              icon={<MoreVertical size="15px" style={{ cursor: 'pointer' }} />}
              items={props.moreActions}
            />
          ) : (
            <Box data-testid="emptyBox" style={{ minWidth: '47px' }} />
          ))}
      </Box>
    </Box>
  );
};
