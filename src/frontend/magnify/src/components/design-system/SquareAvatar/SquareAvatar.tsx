import React from 'react';
import { More } from 'grommet-icons';
import { Avatar } from 'grommet';

export interface SquareAvatarProps {
  src?: string;
  title?: string;
  more?: boolean;
}

export default function SquareAvatar({ src, title, more }: SquareAvatarProps) {
  const dataTestId = more ? 'avatar-more' : src && title ? 'avatar' : 'avatar-spacer';
  return (
    <Avatar round="xsmall" src={src} size="40px" title={title} data-testid={dataTestId}>
      {more && <More color="brand" />}
    </Avatar>
  );
}
