import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Box } from 'grommet';
import { useMatch, useResolvedPath } from 'react-router-dom';
import { MarginType } from 'grommet/utils';

export interface SidebarButtonProps {
  disabled?: boolean;
  margin?: MarginType;
  label: string;
  icon: JSX.Element;
  to: string;
}

export default function SidebarButton(props: SidebarButtonProps) {
  const { to, ...rest } = props;
  const resolvedPath = useResolvedPath(to);
  const match = useMatch({ path: resolvedPath.pathname, end: false });
  const selected = match != null;

  return (
    <Box margin={props.margin}>
      <Button
        primary
        {...(selected ? {} : { color: 'transparent' })}
        as={(p) => <Link to={to} {...p} />}
        {...rest}
        justify="start"
      />
    </Box>
  );
}
