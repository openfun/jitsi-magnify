import { MagnifyPageContent, MagnifyPageContentProps } from '@openfun/magnify-components';

import * as React from 'react';
import { PropsWithChildren } from 'react';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';

export const DefaultPage = ({ children, ...props }: PropsWithChildren<MagnifyPageContentProps>) => {
  return (
    <MagnifyPageContent breadcrumb={<Breadcrumbs />} {...props}>
      {children}
    </MagnifyPageContent>
  );
};
