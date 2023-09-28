import { AxiosError } from 'axios';
import { Box, Text } from 'grommet';
import * as React from 'react';
import { defineMessages } from 'react-intl';
import { useTranslations } from '../../../../i18n';
import { commonMessages } from '../../../../i18n/Messages/commonMessages';
import { MagnifyModal, MagnifyModalProps } from '../index';

const messages = defineMessages({
  modalTitle: {
    defaultMessage: 'An error has occurred because you are not logged in, please log in.',
    description: 'The label of the rooms view.',
    id: 'components.designSystem.modal.errorRequest.modalTitle',
  },
  notLogged: {
    defaultMessage: 'An error has occurred because you are not logged in, please log in.',
    description: 'The label of the rooms view.',
    id: 'components.designSystem.modal.errorRequest.notLogged',
  },
  defaultError: {
    defaultMessage: 'An error has occurred, please retry.',
    description: 'The label of the rooms view.',
    id: 'components.designSystem.modal.errorRequest.notLogged',
  },
});

interface Props extends MagnifyModalProps {
  error?: AxiosError;
}

export const MagnifyErrorRequestModal = ({ error, ...props }: Props) => {
  const intl = useTranslations();

  const getMessage = (): string => {
    if (error && error?.response?.status === 401) {
      return intl.formatMessage(messages.notLogged);
    }
    return intl.formatMessage(messages.defaultError);
  };

  return (
    <MagnifyModal titleModal={intl.formatMessage(commonMessages.error)} {...props}>
      <Box pad="10px">
        <Text size="medium">{getMessage()}</Text>
      </Box>
    </MagnifyModal>
  );
};
