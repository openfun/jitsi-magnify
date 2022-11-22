import { Box, Header } from 'grommet';
import * as React from 'react';
import { FunctionComponent } from 'react';
import styled from 'styled-components';
import { ResponsiveLayoutHeaderAvatar } from './Avatar/ResponsiveLayoutHeaderAvatar';
import { ResponsiveLayoutHeaderNav } from './Nav/ResponsiveLayoutHeaderNav';

const HeaderContainer = styled(Header)`
  background-image: none;
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  flex-shrink: 0;
  top: 0;
  left: auto;
  right: 0;
  color: rgb(33, 43, 54);
  transition: top 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  width: 100%;
  position: sticky;
  z-index: 2;
  box-shadow: rgb(145 158 171 / 16%) 0 8px 16px 0;
  background-color: rgb(255, 255, 255);
  padding: 14px 58px;
  @media all and (max-width: 768px) {
    padding: 6px 15px;
  }
`;

interface ResponsiveLayoutHeaderProps {
  logoSrc?: string;
  logoWidth?: string;
  logoHeight?: string;
}

export const ResponsiveLayoutHeader: FunctionComponent<ResponsiveLayoutHeaderProps> = ({
  ...props
}) => {
  return (
    <HeaderContainer justify={'between'}>
      <Box aria-label={'logo-container'} direction={'row'}>
        {props.logoSrc && (
          <img alt={'logo'} height={props.logoHeight ?? '60px'} src={props.logoSrc} />
        )}
      </Box>

      <Box align={'center'} direction="row" gap="medium" justify={'center'}>
        <ResponsiveLayoutHeaderNav />
        <ResponsiveLayoutHeaderAvatar />
      </Box>
    </HeaderContainer>
  );
};
