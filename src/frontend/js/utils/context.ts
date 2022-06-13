import { handle } from 'utils/errors/handle';

/**
 * Retrieve the context provided by the backend from `__magnify_frontend_context__`
 */
const context = window.__magnify_frontend_context__?.context;

if (!context) {
  const error = new Error('Magnify frontend context is not defined.');
  handle(error);
  throw error;
}

export default context;
