import { Button } from '@openfun/cunningham-react';
import { Avatar, Box, Card } from 'grommet';
import { Trash, User } from 'grommet-icons';
import React, { useRef } from 'react';
import { defineMessages, useIntl } from 'react-intl';

export interface AvatarFormProps {
  id?: string;
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

export const AvatarForm = ({ src: defaultSrc = '' }: AvatarFormProps) => {
  const intl = useIntl();
  const inputRef = useRef<HTMLInputElement>(null);
  const [src, setSrc] = React.useState<string>(defaultSrc);
  const [changed, setChanged] = React.useState<boolean>(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleRemove = () => {
    setChanged(false);
    setSrc(defaultSrc);
  };

  const avatarProps = src !== '' ? { src } : { children: <User size="large" /> };

  return (
    <Box direction="column" width="190px">
      <form onSubmit={handleSubmit}>
        <Card background="light-2" height="190px" width="190px">
          <Avatar
            background="light-4"
            margin="auto"
            size="120px"
            title="Your avatar"
            {...avatarProps}
          />
        </Card>

        {!changed && (
          <label htmlFor="avatar-file-input">
            <Button
              color="primary"
              onClick={() => inputRef?.current?.click()}
              style={{ width: '100%' }}
              type="submit"
            >
              {intl.formatMessage(messages.loadNewButtonLabel)}
            </Button>
          </label>
        )}

        {changed && (
          <Box direction="row" justify="between" margin={{ top: 'small' }}>
            <Button color="primary">{intl.formatMessage(messages.saveNewAvatarButtonLabel)}</Button>
            <Button color="tertiary" icon={<Trash color="accent-1" />} onClick={handleRemove} />
          </Box>
        )}

        <input
          ref={inputRef}
          accept="image/png, image/jpeg"
          id="avatar-file-input"
          name="avatar-file-input"
          style={{ display: 'none' }}
          type="file"
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
      </form>
    </Box>
  );
};
