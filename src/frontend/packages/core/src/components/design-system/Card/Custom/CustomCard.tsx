import * as React from 'react';
import { PropsWithChildren } from 'react';
import styled from 'styled-components';

const CustomStyledCard = styled('div')`
  padding: 20px;
  background: white;
  border: 10px;
  gap: 10px;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  box-shadow: 0px 2px 4px rgb(0 0 0 / 20%);
`;

export const CustomCard = (props: PropsWithChildren) => {
  return <CustomStyledCard>{props.children}</CustomStyledCard>;
};
