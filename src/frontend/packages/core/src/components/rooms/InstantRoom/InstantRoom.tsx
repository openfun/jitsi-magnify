import { Button } from '@openfun/cunningham-react';
import { Form, Formik } from 'formik';
import { Box } from 'grommet';
import * as React from 'react';
import { defineMessages } from 'react-intl';
import { useRouting } from '../../../context';
import { useTranslations } from '../../../i18n';
import { FormikInput } from '../../design-system/Formik/Input/FormikInput';

const messages = defineMessages({
  startButtonLabel: {
    id: 'components.rooms.instantRoom.startButtonLabel',
    defaultMessage: 'Start',
    description: 'Label for the button to start an instant room',
  },
  startInputPlaceHolder: {
    id: 'components.rooms.instantRoom.startInputPlaceHolder',
    defaultMessage: 'Room name',
    description: 'Label for the input to start an instant room',
  },
});

type FormValues = {
  roomName: string;
};

const initialValues: FormValues = {
  roomName: '',
};

export const InstantRoom = () => {
  const routing = useRouting();
  const intl = useTranslations();

  const randomRoom = (length: number = 40): string => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const onSubmit = (values: FormValues): void => {
    const roomName = values.roomName !== '' ? values.roomName : randomRoom();
    routing.goToLiveKitRoom(roomName);
  };

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      <Form>
        <Box flex align="center" direction="row" width="100%">
          <Box style={{ flexGrow: 1 }}>
            <FormikInput
              fullWidth
              label={intl.formatMessage(messages.startInputPlaceHolder)}
              name="roomName"
            />
          </Box>
          <Box margin={{ left: 'small' }}>
            <Button color="primary" type="submit">
              {intl.formatMessage(messages.startButtonLabel)}
            </Button>
          </Box>
        </Box>
      </Form>
    </Formik>
  );
};

export default InstantRoom;
