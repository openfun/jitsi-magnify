import { Box, CheckBox, Menu, Text } from 'grommet';
import { MoreVertical } from 'grommet-icons';
import { ButtonExtendedProps } from 'grommet/components/Button';
import * as React from 'react';
import { defineMessages } from 'react-intl';
import { useTranslations } from '../../../i18n';
import { commonMessages } from '../../../i18n/Messages/commonMessages';
import { User } from '../../../types';
import { UserAvatar } from '../avatar';

const userRowMessages = defineMessages({
  formTitle: {
    defaultMessage: 'Create an account',
    description: 'The title of the signup form',
    id: 'components.auth.SignupForm.formTitle',
  },
});

export interface UserRowProps {
  user: User;
  isSelected?: boolean;
  showSelect?: boolean;
  onToggle?: () => void;
  onDeleteUser?: (user: User) => void;
  rightContent?: React.ReactNode;
  moreActions?: ButtonExtendedProps[];
}

export const UserRow = ({ user, ...props }: UserRowProps) => {
  const intl = useTranslations();
  const getMoreItems = (): ButtonExtendedProps[] => {
    const defaultItems = [
      {
        label: intl.formatMessage(commonMessages.delete),
        onClick: () => props.onDeleteUser?.(user),
      },
    ];
    if (!props.moreActions) {
      return defaultItems;
    }
    return [...defaultItems, ...props.moreActions];
  };

  return (
    <Box
      align={'center'}
      background={'light-2'}
      direction={'row'}
      justify={'between'}
      pad={'xsmall'}
      style={{ borderRadius: '8px' }}
    >
      <Box align={'center'} direction={'row'} gap={'small'} justify={'between'}>
        {props?.showSelect && (
          <Box background={'white'}>
            <CheckBox checked={props.isSelected} onChange={props.onToggle} />
          </Box>
        )}

        <UserAvatar user={user} />
        <Box align={'start'} direction={'column'} justify={'center'}>
          <Text color={'text-strong'} size={'small'} weight={'bold'}>
            {user.name}
          </Text>
          <Text color={'text-xweak'} size={'xsmall'}>
            {user.email}
          </Text>
        </Box>
      </Box>
      <Box align={'center'} direction={'row'} gap={'small'}>
        <Menu
          dropProps={{ align: { top: 'bottom', right: 'right' } }}
          icon={<MoreVertical size={'15px'} />}
          items={getMoreItems()}
        />
      </Box>
    </Box>
  );
};
