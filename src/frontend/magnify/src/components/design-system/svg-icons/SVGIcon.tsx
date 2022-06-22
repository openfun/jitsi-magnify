import React from 'react';
import styled, { CSSProperties } from 'styled-components';
import { normalizeColor } from 'grommet/utils';
import { ThemeContext, ThemeType } from 'grommet';
import { IconProps } from 'grommet-icons';

const StyledRect = styled.rect<RectInternalProps>`
  fill: ${(props) => props.focusColor};
`;

const StyledSVG = styled.svg<SVGInternalProps>`
  path {
    fill: ${(props) => props.iconColor};
  }
`;

interface RectInternalProps {
  focusColor?: string;
}

interface SVGInternalProps {
  iconColor: string;
}

export interface SvgProps extends RectInternalProps {
  containerStyle?: CSSProperties;
  size?: string | number;
  color?: IconProps['color'];
}

export interface SVGIconProps extends SvgProps {
  viewBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// Use https://svg2jsx.com/ to convert svg icon from mockup to component :

export function SVGIcon({
  children,
  containerStyle,
  size = '24px',
  viewBox,
  color,
  focusColor,
}: SVGIconProps & { children: React.ReactNode }) {
  const theme = React.useContext<ThemeType>(ThemeContext);

  return (
    <StyledSVG
      height={size}
      width={size}
      iconColor={normalizeColor(color ?? 'none', theme)}
      style={containerStyle}
      viewBox={
        viewBox
          ? `${-(24 - viewBox.width) / 2} ${-(24 - viewBox.height) / 2} ${24} ${24}`
          : undefined
      }
      xmlns="http://www.w3.org/2000/svg"
    >
      {viewBox && (
        <StyledRect
          focusColor={normalizeColor(focusColor ?? 'none', theme)}
          x={viewBox.x}
          y={viewBox.y}
          width={viewBox.width}
          height={viewBox.height}
          rx="6"
          ry="6"
        />
      )}
      {children}
    </StyledSVG>
  );
}

export default SVGIcon;
