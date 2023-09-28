import { ThemeContext, ThemeType } from 'grommet';
import { normalizeColor } from 'grommet/utils';
import * as React from 'react';
import { useContext } from 'react';
import { User } from '../../../types';
import { UserRowBase, UserRowBaseProps } from './base';

interface UserRowProps extends UserRowBaseProps<User> {
  isSelected?: boolean;
}

export const UserRow = ({ ...props }: UserRowProps) => {
  const theme = useContext<ThemeType>(ThemeContext);
  const brandColor = normalizeColor('brand', theme);
  const getStyles = (): React.CSSProperties => {
    const css = props.style ?? {};
    css.border = `1px solid ${props.isSelected ? brandColor : 'transparent'}`;
    return css;
  };

  return (
    <UserRowBase {...props} className="user-row" id={`user-${props.user.id}`} style={getStyles()} />
  );
};
