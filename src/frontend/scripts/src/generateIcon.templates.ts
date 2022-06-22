export const iconTemplate = (iconName: string) => `import React from 'react';
import SVGIcon, { SvgProps } from '../SVGIcon';

export default function ${iconName}(svgProps: SvgProps) {
  return (
    <SVGIcon viewBox={{ x: 0, y: 0, width: 24, height: 24 }} {...svgProps}>
      {
      // Change width and height depending on viewBox in .svg file
      // Then paste here the outer <g/> tag
      }
    </SVGIcon>
  );
}
`;

export const indexTemplate = (iconName: string) =>
  `export { default as ${iconName} } from './${iconName}';\n`;

export const exportTemplate = (iconName: string) =>
  `export { ${iconName} } from "./${iconName}";\n`;

export const lineToFindInStories = "} as Record";

export const storyTemplate = (iconName: string) =>
  `    ${iconName}: icons.${iconName},`;
