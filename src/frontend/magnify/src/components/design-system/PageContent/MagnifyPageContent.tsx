import { AreasType, Box } from 'grommet';
import { Grid, Heading } from 'grommet/components';
import * as React from 'react';
import { useIsMobile } from '../../../hooks/useIsMobile';

export interface MagnifyPageContentProps {
  children: React.ReactNode;
  title?: string;
  actions?: JSX.Element;
  breadcrumb?: React.ReactNode;
}

function MagnifyPageContent({ ...props }: MagnifyPageContentProps) {
  const isOnMobile = useIsMobile();

  const getAreas = (): AreasType => {
    return isOnMobile
      ? [['title'], ['breadcrumbs'], ['actions']]
      : [
          ['title', 'actions'],
          ['breadcrumbs', 'breadcrumbs'],
        ];
  };

  return (
    <>
      <Grid
        areas={getAreas()}
        columns={isOnMobile ? ['auto'] : ['auto', 'auto']}
        pad={{ vertical: 'medium' }}
        rows={isOnMobile ? ['auto', 'auto', 'auto'] : ['auto', 'auto']}
      >
        <Heading truncate gridArea={'title'} level={3} margin={{ vertical: 'none' }} size="small">
          {props?.title}
        </Heading>

        <Box
          direction={'row'}
          gridArea={'actions'}
          justify={isOnMobile ? 'start' : 'end'}
          width={'auto'}
        >
          {props.actions}
        </Box>

        <Box gridArea={'breadcrumbs'}>{props.breadcrumb}</Box>
      </Grid>

      {props.children}
    </>
  );
}

export { MagnifyPageContent };
