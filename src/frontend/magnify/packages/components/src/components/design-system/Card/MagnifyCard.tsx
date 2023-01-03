import { Box, CardBody, CardHeader, Heading } from 'grommet';
import { BoxTypes } from 'grommet/components/Box';
import * as React from 'react';
import { FunctionComponent } from 'react';
import { CustomCard } from './Custom';

export interface MagnifyCardProps extends BoxTypes {
  title?: string;
  gapContent?: string;
}
export const MagnifyCard: FunctionComponent<MagnifyCardProps> = ({ ...props }) => {
  return (
    <CustomCard>
      <Box {...props}>
        {props.title && (
          <CardHeader>
            <Heading color={'brand'} level={3}>
              {props.title}
            </Heading>
          </CardHeader>
        )}
        <CardBody gap={props.gapContent}>{props.children}</CardBody>
      </Box>
    </CustomCard>
  );
};
