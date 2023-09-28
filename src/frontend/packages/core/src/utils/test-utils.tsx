// Disable extraneous dependencies rule because this file is only used in development
/* eslint-disable import/no-extraneous-dependencies */
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { ReactElement } from 'react';
import { MagnifyTestingProvider } from '../components';

export const renderWrappedInTestingProvider = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
): RenderResult => render(ui, { wrapper: MagnifyTestingProvider, ...options });
