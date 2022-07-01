import { Box, Button, ThemeType } from 'grommet';
import { MarginType } from 'grommet/utils';
import React from 'react';
import { Link, useMatch, useResolvedPath } from 'react-router-dom';
import styled from 'styled-components';

export interface SidebarButtonProps {
  disabled?: boolean;
  margin?: MarginType;
  label: string;
  icon?: JSX.Element;
  navigateTo: string;
}

const conditionalColor =
  (colorActive: string, colorInnactive: string) =>
  ({ theme, active }: { theme: ThemeType; active: boolean }) =>
    active
      ? theme?.global?.colors?.[colorActive] || colorActive
      : theme?.global?.colors?.[colorInnactive] || colorInnactive;

const HoverableButton = styled(Button)`
  background-color: ${conditionalColor('brand', 'transparent')};
  color: ${conditionalColor('light-1', 'dark-1')};
  & path {
    fill: ${conditionalColor('light-1', 'dark-1')};
  }
  border-color: ${conditionalColor('brand', 'transparent')};
  &:hover {
    background-color: ${conditionalColor('brand', 'light-2')};
    border-color: ${conditionalColor('brand', 'transparent')};
    box-shadow: ${(props: { theme: ThemeType; active: boolean }) =>
      props.active ? '0px 0px 0px 1px ' + props.theme?.global?.colors?.brand : 'none'};
  }
`;

export default function SidebarButton(props: SidebarButtonProps) {
  const { navigateTo, label, margin, disabled, icon } = props;
  const resolvedPath = useResolvedPath(navigateTo);
  const match = useMatch({ path: resolvedPath.pathname, end: false });
  const active = match != null;

  return (
    <Box margin={margin}>
      <HoverableButton
        primary
        active={active}
        disabled={disabled}
        label={label}
        icon={icon}
        forwardedAs={({ children, type, className }) => (
          <Link type={type} className={className} to={navigateTo}>
            {children}
          </Link>
        )}
        justify="start"
      />
    </Box>
  );
}
