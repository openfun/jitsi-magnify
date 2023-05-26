import { BoxProps } from 'grommet';
import * as React from 'react';
import { PropsWithChildren } from 'react';
import styled from 'styled-components';

const CustomListContainer = styled('div')`
  gap: 10px;
  display: flex;
  flex-direction: column;
`;

export const MagnifyListContainer = (props: PropsWithChildren<BoxProps>) => {
  return <CustomListContainer {...props}>{props.children}</CustomListContainer>;
};
