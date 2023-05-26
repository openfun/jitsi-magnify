import { Box, Button, Heading, Layer, LayerProps } from 'grommet';
import { Close } from 'grommet-icons';
import * as React from 'react';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { commonMessages } from '../../../i18n/Messages/commonMessages';

export enum MagnifyModalTypes {
  NORMAL = 'normal',
  WARNING = 'warning',
}

export interface MagnifyModalProps extends LayerProps {
  modalUniqueId: string;
  isOpen?: boolean;
  children?: React.ReactNode;
  showFooter?: boolean;
  type?: MagnifyModalTypes;
  validateButtonLabel?: string;
  validateButtonColor?: string;
  validateButtonCallback?: () => void;
  onClose?: () => void;
  titleModal?: string;
  footer?: React.ReactNode;
}

export const MagnifyModal = ({
  type = MagnifyModalTypes.NORMAL,
  validateButtonColor = 'brand',
  ...props
}: MagnifyModalProps) => {
  const intl = useIntl();
  const getFooter = (): React.ReactNode => {
    if (props.showFooter != null && !props.showFooter) {
      return <></>;
    }
    if (props.footer != null) {
      return (
        <Box direction={'row'} gap={'medium'} pad={'small'}>
          <Button
            secondary
            label={intl.formatMessage(commonMessages.cancel)}
            onClick={props.onClose}
          />
          {props.footer}
        </Box>
      );
    }

    return (
      <Box direction={'row'} gap={'small'} pad={'small'}>
        <Button
          secondary
          label={intl.formatMessage(commonMessages.cancel)}
          onClick={props.onClose}
        />
        {type === MagnifyModalTypes.WARNING && (
          <Button
            primary
            color={validateButtonColor}
            label={props.validateButtonLabel ?? intl.formatMessage(commonMessages.yes)}
            onClick={() => {
              props.onClose?.();
              props.validateButtonCallback?.();
            }}
          />
        )}
      </Box>
    );
  };

  return (
    <>
      {props.isOpen && (
        <Layer {...props} id={props.modalUniqueId}>
          <Box pad={'small'} style={{ position: 'relative' }} width={'100%'}>
            <Box style={{ position: 'absolute', top: '10px', right: '10px' }}>
              <Close color={'white'} cursor={'pointer'} onClick={props.onClose} size={'small'} />
            </Box>
            {props.titleModal != null && (
              <Heading level={4} margin={'small'}>
                {props.titleModal}
              </Heading>
            )}
            <Box>{props.children}</Box>
            <Box align={'end'} justify={'center'} width={'100%'}>
              {getFooter()}
            </Box>
          </Box>
        </Layer>
      )}
    </>
  );
};

export const useMagnifyModal = () => {
  const [open, setOpen] = useState(false);
  const openModal = (event?: any, openCallback?: () => void): void => {
    setOpen(true);
    openCallback?.();
  };

  const closeModal = (event?: any, closeCallback?: () => void): void => {
    setOpen(false);
    closeCallback?.();
  };

  return {
    isOpen: open,
    onClickOutside: () => closeModal(),
    onClose: () => closeModal(),
    openModal,
    closeModal,
  };
};
