import React from "react";
import { Link } from 'react-router-dom';
import { Button } from "grommet";

export interface SidebarButtonProps {
    selected?: boolean;
    disabled?: boolean;
    label: string;
    icon: JSX.Element;
    to: string;
}

export default function SidebarButton(props: SidebarButtonProps) {
  const {selected, to, ...rest} = props;

  return <Button
    primary
    {...(selected ? {} : { color: 'transparent' })}
    as={(p) => <Link to={to} {...p}/>}
    {...rest}
  />;
}