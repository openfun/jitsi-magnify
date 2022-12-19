import { Formik } from 'formik';
import { Box, Button, Notification, Spinner, Text } from 'grommet';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { defineMessages } from 'react-intl';
import { useTranslations } from '../../../i18n';
import { commonMessages } from '../../../i18n/Messages/commonMessages';
import { UsersRepository } from '../../../services';
import { User } from '../../../types';
import { Maybe } from '../../../types/misc';
import { FormikInput } from '../../design-system/Formik/Input';
import { FormikValuesChange } from '../../design-system/Formik/ValuesChange/FormikValuesChange';
import { MagnifyModal, MagnifyModalProps } from '../../design-system/Modal';
import { UserRow } from '../row';

const messages = defineMessages({
  searchUserPlaceholder: {
    defaultMessage: 'Search by email or full username',
    description: 'Placeholder for the search user input in the search user modal',
    id: 'components.users.searchModal.searchUserPlaceholder',
  },
  searchUserLabel: {
    defaultMessage: 'Find a user',
    description: 'Label for the search user input in the search user modal',
    id: 'components.users.searchModal.searchUserLabel',
  },
  searchUserErrorText: {
    defaultMessage: 'An error has occurred',
    description: 'Label for the search user error message',
    id: 'components.users.searchModal.searchUserErrorText',
  },
  emptyResult: {
    defaultMessage: 'No results with this email or username',
    description: 'Empty search result string',
    id: 'components.users.searchModal.emptyResult',
  },
});

export interface UserSearchModalProps extends MagnifyModalProps {
  onSelectUser: (user?: User) => void;
}

export const UserSearchModal = ({ onSelectUser, ...props }: UserSearchModalProps) => {
  const intl = useTranslations();
  const [users, setUsers] = useState<Maybe<User[]>>(undefined);
  const [selectedUser, setSelectedUser] = useState<Maybe<User>>(undefined);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (props.isOpen) {
      return;
    }
    setLoading(false);
    setSelectedUser(undefined);
    setUsers(undefined);
  }, [props.isOpen]);

  const onSearch = (term: string): void => {
    if (term.length === 0) {
      setHasError(false);
      setUsers(undefined);
      return;
    }
    setLoading(true);
    setHasError(false);
    UsersRepository.search(term)
      .then((data) => {
        setLoading(false);
        setUsers(data);
      })
      .catch(() => {
        setHasError(true);
        setLoading(false);
      });
  };

  const handleSubmit = (): void => {
    onSelectUser(selectedUser);
  };

  return (
    <MagnifyModal
      {...props}
      footer={
        <Button
          primary
          disabled={!selectedUser}
          label={intl.formatMessage(commonMessages.add)}
          onClick={handleSubmit}
        />
      }
    >
      <Box pad={'small'} width={{ width: '100%', min: 'medium' }}>
        <Formik initialValues={{ search: '' }} onSubmit={(values) => onSearch(values.search)}>
          <FormikValuesChange debounceTime={400}>
            <Box align={'center'} gap={'medium'} justify={'center'} width={'100%'}>
              <FormikInput
                label={intl.formatMessage(messages.searchUserLabel)}
                name={'search'}
                placeholder={intl.formatMessage(messages.searchUserPlaceholder)}
              />
              {loading && <Spinner />}
              {hasError && (
                <Box width={'100%'}>
                  <Notification
                    message={intl.formatMessage(messages.searchUserErrorText)}
                    status="critical"
                    title={intl.formatMessage(commonMessages.error)}
                  />
                </Box>
              )}
              {!hasError && users && !loading && (
                <>
                  {users.length === 0 && <Text>{intl.formatMessage(messages.emptyResult)}</Text>}
                  {users.map((user) => {
                    return (
                      <UserRow
                        key={user.id}
                        isSelected={selectedUser?.id === user.id}
                        onClick={(user) => setSelectedUser(user)}
                        user={user}
                      />
                    );
                  })}
                </>
              )}
            </Box>
          </FormikValuesChange>
        </Formik>
      </Box>
    </MagnifyModal>
  );
};
