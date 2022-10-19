import { MagnifyPageContent, MagnifyPageContentProps } from '@jitsi-magnify/core';

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
