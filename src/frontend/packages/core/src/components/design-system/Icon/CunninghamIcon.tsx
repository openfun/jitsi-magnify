import * as React from 'react';

interface Props {
  iconName: string;
}

export const CunninghamIcon = (props: Props) => {
  return <span className="material-icons">{props.iconName}</span>;
};
