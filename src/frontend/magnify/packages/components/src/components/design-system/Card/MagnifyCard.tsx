import { Card, CardBody, CardHeader, Heading } from 'grommet';
import { BoxTypes } from 'grommet/components/Box';
import * as React from 'react';
import { FunctionComponent } from 'react';

export interface MagnifyCardProps extends BoxTypes {
  title?: string;
}
export const MagnifyCard: FunctionComponent<MagnifyCardProps> = ({ ...props }) => {
  return (
    <Card background={'white'} height={'100%'} pad={'medium'} {...props}>
      {props.title && (
        <CardHeader>
          <Heading color={'brand'} level={3}>
            {props.title}
          </Heading>
        </CardHeader>
      )}
      <CardBody>{props.children}</CardBody>
    </Card>
  );
};
