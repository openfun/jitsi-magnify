import { Nullable } from '../types/misc';
import Controller from './interface';
import MockControllerFunction from './MockControllerFunction';
import { ConnexionStatus, Store } from './store';

/**
 * Factory to mock a function that returns a promise.
 * It await 700ms before resolving the promise searching
 * the received arguments in the mock resolver for the key
 * in the given "resolveTo", or even in "rejectTo".
 *
 * If there is a such key, resolve or reject the promise with the value.
 * Elese, resolve the "default" (may be undefined).
 *
 * @param name The name of the function to mock.
 * @param resolveTo The map of keys to values to resolve the promise.
 * @param rejectTo A map of keys to values to reject the promise.
 *
 * @returns The promise that will be resolved or rejected.
 */
export default function promisifiedConsoleLogFactory<
  TController extends Controller,
  T,
  TInput,
  TError,
>(
  controller: TController,
  name: string,
  resolver = new MockControllerFunction<TInput, T, TError>(),
  protectedRoute = true,
) {
  return async function (args?: any): Promise<T> {
    const requestPromiseFactory = (): Promise<T> =>
      new Promise((resolve, reject) => {
        setTimeout(() => {
          // 1) Log the call to the console.
          console.log(
            `%c${name}: %c\njwt:${controller._jwt}%c\ninput:${JSON.stringify(args, null, '  ')}`,
            'color: green; font-weight: bold',
            'color: red; font-weight: bold',
            'color: #00a',
          );

          // 2) For protected routes, raise error if no jwt.
          if (protectedRoute && (!controller._jwt || controller._jwt !== 'successful-access')) {
            reject(new Error('Unauthorized'));
            return;
          }

          // 3) Resolve or reject the promise with the value.
          resolver.run(
            args,
            (resolvedValue) => {
              console.log(
                `%c${name}: %c\noutput:${JSON.stringify(resolvedValue, null, '  ')}`,
                'color: green; font-weight: bold',
                'color: #00a',
              );
              resolve(resolvedValue);
            },
            reject,
          );
        }, 700);
      });

    let res: Nullable<T> = null;
    let shouldTryToRefresh = false;
    try {
      res = await requestPromiseFactory();
    } catch (error: any) {
      console.log('Error', error.message);
      if (error.message === 'Unauthorized') shouldTryToRefresh = true;
      else throw error;
    }

    if (shouldTryToRefresh) {
      try {
        console.log('Trying to refresh the token...');
        await controller.refresh('refresh-token');
        if (!controller._jwt) throw new Error('No jwt after refresh');
        res = await requestPromiseFactory();
      } catch {
        console.log("Couldn't refresh the token.");
        controller._setStore(
          (pStore): Store => ({
            ...pStore,
            connexionStatus: ConnexionStatus.DISCONNECTED,
          }),
        );
      }
    }

    return res as T;
  };
}
