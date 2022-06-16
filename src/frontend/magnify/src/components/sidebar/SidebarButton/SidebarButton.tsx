import React from 'react';
import { Link, useMatch, useResolvedPath } from 'react-router-dom';
import { Box, Button } from 'grommet';
import { MarginType } from 'grommet/utils';

export interface SidebarButtonProps {
  disabled?: boolean;
  margin?: MarginType;
  label: string;
  icon?: JSX.Element;
  navigateTo: string;
}

export default function SidebarButton(props: SidebarButtonProps) {
  const [hover, setHover] = React.useState(false);
  const [customColor, setCustomColor] = React.useState('');
  const { navigateTo, label, margin, disabled, icon } = props;
  const resolvedPath = useResolvedPath(navigateTo);
  const match = useMatch({ path: resolvedPath.pathname, end: false });
  const active = match != null;

  React.useEffect(() => {
    setCustomColor(active ? '' : hover ? 'light-3' : 'transparent');
  }, [hover, active]);

  return (
    <Box margin={margin}>
      <Button
        primary
        color={customColor}
        disabled={disabled}
        label={label}
        icon={icon}
        as={({ children, type, className }) => (
          <Link
            type={type}
            className={className}
            to={navigateTo}
            onMouseEnter={() => {
              setHover(true);
            }}
            onMouseLeave={() => {
              setHover(false);
            }}
          >
            {children}
          </Link>
        )}
        justify="start"
      />
    </Box>
  );
}
