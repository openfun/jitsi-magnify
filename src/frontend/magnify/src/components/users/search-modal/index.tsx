import { Formik } from 'formik';
import { Box, Button, Spinner, Text, ThemeContext, ThemeType } from 'grommet';
import { normalizeColor } from 'grommet/utils';
import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { defineMessages } from 'react-intl';
import { useTranslations } from '../../../i18n';
import { commonMessages } from '../../../i18n/Messages/commonMessages';
import { User } from '../../../types';
import { Maybe } from '../../../types/misc';
import FormikInput from '../../design-system/Formik/Input';
import { FormikValuesChange } from '../../design-system/Formik/ValuesChange/FormikValuesChange';
import { MagnifyModal, MagnifyModalProps } from '../../design-system/Modal';
import { UserRow } from '../row';

const messages = defineMessages({
  searchUserPlaceholder: {
    defaultMessage: 'Search by email or full username',
    description: 'Placeholder for the search user input in the search user modal',
    id: 'components.rooms.config.users.searchUserPlaceholder',
  },
  searchUserLabel: {
    defaultMessage: 'Find a user',
    description: 'Label for the search user input in the search user modal',
    id: 'components.rooms.config.users.searchUserLabel',
  },
  emptyResult: {
    defaultMessage: 'No results with this email or username',
    description: 'Empty search result string',
    id: 'components.rooms.config.users.emptyResult',
  },
});

export interface UserSearchModalProps extends MagnifyModalProps {
  onSelectUser: (user?: User) => void;
  onSearchUser: (term: string) => Promise<User[]>;
}

export const UserSearchModal = ({ onSelectUser, onSearchUser, ...props }: UserSearchModalProps) => {
  const intl = useTranslations();
  const [users, setUsers] = useState<Maybe<User[]>>(undefined);
  const [selectedUser, setSelectedUser] = useState<Maybe<User>>(undefined);
  const [loading, setLoading] = useState(false);
  const theme = useContext<ThemeType>(ThemeContext);
  const brandColor = normalizeColor('brand', theme);

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
      setUsers(undefined);
      return;
    }
    setLoading(true);
    onSearchUser(term).then((data) => {
      setLoading(false);
      setUsers(data);
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
              {users && !loading && (
                <>
                  {users.length === 0 && <Text>{intl.formatMessage(messages.emptyResult)}</Text>}
                  {users.map((user) => {
                    return (
                      <UserRow
                        key={user.id}
                        onClick={(user) => setSelectedUser(user)}
                        showActions={false}
                        user={user}
                        style={{
                          border: `1px solid ${
                            selectedUser?.id === user.id ? brandColor : 'transparent'
                          }`,
                        }}
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
