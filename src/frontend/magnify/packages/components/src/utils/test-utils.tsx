import { render, RenderOptions, RenderResult } from '@testing-library/react';
import React, { ReactElement } from 'react';
import { MagnifyTestingProvider } from '../components';

export const renderWrappedInTestingProvider = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
): RenderResult => render(ui, { wrapper: MagnifyTestingProvider, ...options });
