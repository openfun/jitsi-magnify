import { Box, Heading, HeadingProps } from 'grommet';
import React from 'react';

export interface SectionProps {
  title?: string;
  titleLevel?: HeadingProps['level'];
  children?: React.ReactNode;
}

const Section = ({ children, title, titleLevel = 3 }: SectionProps) => (
  <Box background={'white'} round="xsmall" elevation="small" pad="medium" height="100%">
    {title && (
      <Heading color="brand" level={titleLevel} margin={{ top: '0' }}>
        {title}
      </Heading>
    )}
    {children}
  </Box>
);

export default Section;
