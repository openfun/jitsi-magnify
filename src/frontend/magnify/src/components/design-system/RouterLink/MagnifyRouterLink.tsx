import * as React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import styled from 'styled-components';

export interface MagnifyRouterLinkProps extends LinkProps {}

const RouterLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

function MagnifyRouterLink({ ...props }: MagnifyRouterLinkProps) {
  return <RouterLink {...props} />;
}

export default MagnifyRouterLink;
