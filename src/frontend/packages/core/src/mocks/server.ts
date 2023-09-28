// Disable extraneous dependencies rule because this file is only used in development
/* eslint-disable import/no-extraneous-dependencies */
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
