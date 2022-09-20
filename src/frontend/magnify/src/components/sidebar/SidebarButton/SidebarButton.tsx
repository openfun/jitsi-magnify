import { Box } from 'grommet';
import { MarginType } from 'grommet/utils';
import React from 'react';
import { Link, useMatch, useResolvedPath } from 'react-router-dom';
import { ActivableButton } from '../../design-system';

export interface SidebarButtonProps {
  disabled?: boolean;
  margin?: MarginType;
  label: string;
  icon?: JSX.Element;
  navigateTo: string;
}

export default function SidebarButton(props: SidebarButtonProps) {
  const { navigateTo, label, margin, disabled, icon } = props;
  const resolvedPath = useResolvedPath(navigateTo);
  const match = useMatch({ path: resolvedPath.pathname, end: false });
  const active = match != null;

  return (
    <Box margin={margin}>
      <ActivableButton
        primary
        active={active}
        disabled={disabled}
        icon={icon}
        justify="start"
        label={label}
        forwardedAs={({ children, type, className }) => (
          <Link className={className} to={navigateTo} type={type}>
            {children}
          </Link>
        )}
      />
    </Box>
  );
}
