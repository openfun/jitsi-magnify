import React from 'react';
import { More } from 'grommet-icons';
import { Avatar as GrommetAvatar, AvatarExtendedProps } from 'grommet';

export interface SquareAvatarProps {
  src?: string;
  title?: string;
  more?: boolean;
}

function Avatar(props: AvatarExtendedProps) {
  return <GrommetAvatar round="xsmall" size="40px" {...props} />;
}

export default function SquareAvatar({ src, title, more }: SquareAvatarProps) {
  // Case 1: we want to display a "..." icon
  if (more)
    return (
      <Avatar title={title} data-testid="avatar-more">
        <More color="brand" />
      </Avatar>
    );

  // Case 2: we want to display the user's avatar
  if (src && src.length > 0) return <Avatar src={src} title={title} data-testid="avatar" />;

  // Case 3: We want to display the user's avatar but he doesn't have one, so we display his first letters
  if ((!src || src === '') && title && title !== '') {
    const hash = 1 + ((title?.charCodeAt(0) || 0) % 4);
    return (
      <Avatar title={title} data-testid="avatar" background={`accent-${hash}`}>
        {title
          .split(' ')
          .map((w) => w[0])
          .join('')}
      </Avatar>
    );
  }

  // Case 4: we want to display a spacer
  return <Avatar data-testid="avatar-spacer" />;
}
