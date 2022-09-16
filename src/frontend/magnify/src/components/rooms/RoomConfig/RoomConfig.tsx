import {
  AreasType,
  Box,
  Grid,
  GridColumnsType,
  GridSizeType,
  ResponsiveContext,
  ResponsiveValue,
} from 'grommet';
import React, { useContext } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Formik } from 'formik';


import { FormikValuesChange } from '../../design-system/Formik/ValuesChange/FormikValuesChange';
import FormikSwitch from '../../design-system/Formik/FormikSwitch';
import MagnifyCard from "../../design-system/Card";

const messages = defineMessages({
  settingsTitle: {
    defaultMessage: `Settings`,
    description: 'Title for the room configuration section with general settings',
    id: 'components.rooms.config.settingsTitle',
  },
  enableChat: {
    defaultMessage: `Enable chat`,
    description: 'Label for the toggle in the room configuration that enables chat',
    id: 'components.rooms.config.enableChat',
  },
  enableScreenSharing: {
    defaultMessage: `Enable screen sharing`,
    description: 'Label for the toggle in the room configuration that enables screen sharing',
    id: 'components.rooms.config.enableScreenSharing',
  },
  moderationTitle: {
    defaultMessage: `Moderation`,
    description: 'Title for the room configuration section with moderation settings',
    id: 'components.rooms.config.moderationTitle',
  },
  everyoneStartsMuted: {
    defaultMessage: `Everyone starts muted`,
    description:
      'Label for the toggle in the room configuration that makes everyone starting muted',
    id: 'components.rooms.config.everyoneStartsMuted',
  },
  everyoneStartsWithoutCamera: {
    defaultMessage: `Everyone starts without camera`,
    description:
      'Label for the toggle in the room configuration that makes everyone starting without camera',
    id: 'components.rooms.config.everyoneStartsWithoutCamera',
  },
  securityTitle: {
    defaultMessage: `Security`,
    description: 'Title for the room configuration section with security settings',
    id: 'components.rooms.config.securityTitle',
  },
  enableWaitingRoom: {
    defaultMessage: `Enable waiting room`,
    description:
      'Label for the toggle in the room configuration (security) that enables the waiting room',
    id: 'components.rooms.config.enableWaitingRoom',
  },
  askForPassword: {
    defaultMessage: `Ask for password`,
    description:
      'Label for the toggle in the room configuration (security) that enables asking for a password when joining a room',
    id: 'components.rooms.config.askForPassword',
  },
  askForAuthentication: {
    defaultMessage: `Ask for authentication`,
    description:
      'Label for the toggle in the room configuration (security) that enables asking for authentication when joining a room',
    id: 'components.rooms.config.askForAuthentication',
  },
});

const RoomConfig = ({ roomName }: { roomName: string }) => {
  const intl = useIntl();
  const size = useContext(ResponsiveContext);
  const initialValues = {
    chatEnabled: true,
    screenSharingEnabled: true,
    everyoneStartsMuted: true,
    everyoneStartsWithoutCamera: true,
    waitingRoomEnabled: true,
    askForPassword: true,
    askForAuthentication: true,
  };

  const isMobile = size === 'small';

  const columns: Record<ResponsiveValue, GridColumnsType> = {
    small: ['auto'],
    medium: ['auto', 'auto'],
  };

  const rows: Record<ResponsiveValue, GridSizeType[]> = {
    small: ['auto', 'auto', 'auto'],
    medium: ['auto', 'auto'],
  };

  // set the different areas you need for every size
  const areas: Record<ResponsiveValue, AreasType> = {
    small: [
      { name: 'settings', start: [0, 0], end: [0, 0] },
      { name: 'moderation', start: [0, 1], end: [0, 1] },
      { name: 'security', start: [0, 2], end: [0, 2] },
    ],
    medium: [
      { name: 'settings', start: [0, 0], end: [1, 0] },
      { name: 'moderation', start: [0, 1], end: [0, 1] },
      { name: 'security', start: [1, 1], end: [1, 1] },
    ],
  };

  return (
    <Formik initialValues={initialValues} onSubmit={(values) => console.log(values)}>
      <FormikValuesChange>
        <Grid
          areas={isMobile ? areas.small : areas.medium}
          columns={isMobile ? columns.small : columns.medium}
          rows={isMobile ? rows.small : rows.medium}
          gap={'20px'}
        >
          <Box gridArea={'settings'}>
            <MagnifyCard title={intl.formatMessage(messages.settingsTitle)}>
              <Box gap={'10px'}>
                <FormikSwitch
                  name={'chatEnabled'}
                  label={intl.formatMessage(messages.enableChat)}
                />
                <FormikSwitch
                  name={'screenSharingEnabled'}
                  label={intl.formatMessage(messages.enableScreenSharing)}
                />
              </Box>
            </MagnifyCard>
          </Box>
          <Box gridArea={'moderation'} gap={'10px'}>
            <MagnifyCard title={intl.formatMessage(messages.moderationTitle)}>
              <Box height={'100%'} gap={'medium'}>
                <FormikSwitch
                  name={'everyoneStartsMuted'}
                  label={intl.formatMessage(messages.everyoneStartsMuted)}
                />
                <FormikSwitch
                  name={'everyoneStartsWithoutCamera'}
                  label={intl.formatMessage(messages.everyoneStartsWithoutCamera)}
                />
              </Box>
            </MagnifyCard>
          </Box>

          <Box gridArea={'security'} gap={'10px'}>
            <MagnifyCard title={intl.formatMessage(messages.securityTitle)}>
              <Box gap={'medium'}>
                <FormikSwitch
                  name={'waitingRoomEnabled'}
                  label={intl.formatMessage(messages.enableWaitingRoom)}
                />
                <FormikSwitch
                  name={'askForPassword'}
                  label={intl.formatMessage(messages.askForPassword)}
                />
                <FormikSwitch
                  name={'askForAuthentication'}
                  label={intl.formatMessage(messages.askForAuthentication)}
                />
              </Box>
            </MagnifyCard>
          </Box>
        </Grid>
      </FormikValuesChange>
    </Formik>
  );
};

export default RoomConfig;
