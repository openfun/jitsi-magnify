import { Box, CardBody, CardHeader, Heading } from 'grommet';
import { BoxTypes } from 'grommet/components/Box';
import * as React from 'react';
import { FunctionComponent } from 'react';
import { CustomCard } from './Custom';

export interface MagnifyCardProps extends BoxTypes {
  title?: string;
  actions?: React.ReactNode;
  gapContent?: string;
}
export const MagnifyCard: FunctionComponent<MagnifyCardProps> = ({ ...props }) => {
  return (
    <CustomCard>
      <Box {...props}>
        {props.title && (
          <CardHeader>
            <Box
              flex
              align="center"
              direction="row"
              justify="between"
              margin={{ bottom: 'medium' }}
            >
              <Heading color="brand" level={4} margin="none">
                {props.title}
              </Heading>
              <Box>{props.actions}</Box>
            </Box>
          </CardHeader>
        )}
        <CardBody gap={props.gapContent}>{props.children}</CardBody>
      </Box>
    </CustomCard>
  );
};
