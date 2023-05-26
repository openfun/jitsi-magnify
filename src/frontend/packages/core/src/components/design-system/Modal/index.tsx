import { Button } from '@openfun/cunningham-react';
import { Box, Heading, Layer, LayerProps } from 'grommet';
import { Close } from 'grommet-icons';
import { ReactNode, useState } from 'react';
import { useIntl } from 'react-intl';
import { commonMessages } from '../../../i18n/Messages/commonMessages';

export enum MagnifyModalTypes {
  NORMAL = 'normal',
  WARNING = 'warning',
}

export interface MagnifyModalProps extends LayerProps {
  modalUniqueId: string;
  isOpen?: boolean;
  children?: ReactNode;
  showFooter?: boolean;
  type?: MagnifyModalTypes;
  validateButtonLabel?: string;
  validateButtonColor?: string;
  validateButtonCallback?: () => void;
  onClose?: () => void;
  titleModal?: string;
  footer?: ReactNode;
}

export const MagnifyModal = ({
  type = MagnifyModalTypes.NORMAL,
  validateButtonColor = 'brand',
  ...props
}: MagnifyModalProps) => {
  const intl = useIntl();
  const getFooter = (): ReactNode => {
    if (props.showFooter != null && !props.showFooter) {
      return <></>;
    }
    if (props.footer != null) {
      return (
        <Box direction={'row'} gap={'medium'} pad={'small'}>
          <Button color="secondary" onClick={props.onClose}>
            {intl.formatMessage(commonMessages.cancel)}
          </Button>
          {props.footer}
        </Box>
      );
    }

    return (
      <Box direction={'row'} gap={'small'} pad={'small'}>
        <Button color="secondary" onClick={props.onClose}>
          {intl.formatMessage(commonMessages.cancel)}
        </Button>
        {type === MagnifyModalTypes.WARNING && (
          <Button
            color="primary"
            onClick={() => {
              props.onClose?.();
              props.validateButtonCallback?.();
            }}
          >
            props.validateButtonLabel ?? intl.formatMessage(commonMessages.yes)
            {intl.formatMessage(commonMessages.cancel)}
          </Button>
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
