import * as React from 'react';
import { PropsWithChildren } from 'react';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import { MagnifyPageContent, MagnifyPageContentProps } from '../design-system';

interface Props extends MagnifyPageContentProps {
  enableBreadcrumb?: boolean;
}

export const DefaultPage = ({ children, ...props }: PropsWithChildren<Props>) => {
  return (
    <MagnifyPageContent breadcrumb={props.enableBreadcrumb ?? <Breadcrumbs />} {...props}>
      {children}
    </MagnifyPageContent>
  );
};
