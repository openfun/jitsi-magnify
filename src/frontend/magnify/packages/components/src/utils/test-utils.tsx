import { render, RenderOptions } from '@testing-library/react';
import React, { ReactElement } from 'react';
import { MagnifyTestingProvider } from '../components';

// @ts-ignore
const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: MagnifyTestingProvider, ...options });

export * from '@testing-library/react';
export { customRender as render };
