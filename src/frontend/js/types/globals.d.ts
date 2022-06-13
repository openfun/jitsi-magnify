import { CommonDataProps } from 'types/commonDataProps';

declare global {
  const MAGNIFY_VERSION: string;
  interface Window {
    __magnify_frontend_context__: CommonDataProps;
    __MAGNIFY__: () => Promise<void>;
  }
}
