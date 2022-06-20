import { Avatar, Box, Button, Card } from 'grommet';
import { User } from 'grommet-icons';
import React from 'react';
import { Trash } from 'grommet-icons';
import { defineMessages, useIntl } from 'react-intl';

export interface AvatarFormProps {
  src?: string;
}

const messages = defineMessages({
  loadNewButtonLabel: {
    defaultMessage: 'Load new avatar',
    description: 'Call to action on the load new avatar button',
    id: 'components.profile.AvatarForm.loadNewButtonLabel',
  },
  removeButtonLabel: {
    defaultMessage: 'Remove avatar',
    description: 'Call to action on the remove avatar button',
    id: 'components.profile.AvatarForm.removeButtonLabel',
  },
  saveNewAvatarButtonLabel: {
    defaultMessage: 'Save',
    description: 'Call to action on the save new avatar button',
    id: 'components.profile.AvatarForm.saveNewAvatarButtonLabel',
  },
});

export default function AvatarForm({ src: defaultSrc = '' }: AvatarFormProps) {
  const intl = useIntl();
  const [src, setSrc] = React.useState<string>(defaultSrc);
  const [changed, setChanged] = React.useState<boolean>(false);

  const handleSubmit = () => {
    setChanged(false);
  };

  const handleRemove = () => {
    setChanged(false);
    setSrc(defaultSrc);
  };

  const avatarProps = src !== '' ? { src } : { children: <User size="large" /> };

  return (
    <Box direction="column" width="190px">
      <Card width="190px" height="190px" background="light-2">
        <Avatar
          size="120px"
          margin="auto"
          title="Your avatar"
          background="light-4"
          {...avatarProps}
        />
      </Card>

      {!changed && (
        <label htmlFor="avatar-file-input">
          <Button
            label={intl.formatMessage(messages.loadNewButtonLabel)}
            margin={{ top: 'small' }}
            primary
            as="div"
            style={{ width: '100%' }}
          />
        </label>
      )}

      {changed && (
        <Box direction="row" margin={{ top: 'small' }}>
          <Button
            label={intl.formatMessage(messages.saveNewAvatarButtonLabel)}
            primary
            onClick={handleSubmit}
            style={{ flexGrow: 1 }}
            margin={{ right: 'small', vertical: 'auto' }}
          />
          <Button
            icon={<Trash />}
            hoverIndicator
            onClick={handleRemove}
            tip={intl.formatMessage(messages.removeButtonLabel)}
          />
        </Box>
      )}

      <input
        name="avatar-file-input"
        id="avatar-file-input"
        accept="image/png, image/jpeg"
        type="file"
        style={{ display: 'none' }}
        onChange={(event) => {
          const file = event.target.files && event.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              if (e.target) {
                setSrc(e.target.result as string);
                setChanged(true);
              }
            };
            reader.readAsDataURL(file);
          }
        }}
      />
    </Box>
  );
}
