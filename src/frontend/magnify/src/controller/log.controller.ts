import Controller from './interface';
import { example1, example2 } from './mocks/example';

const promisifiedConsoleLogFactory =
  <T>(name: string, resolveTo: T) =>
  (...args: any[]): Promise<T> =>
    new Promise((resolve) => {
      setTimeout(() => {
        console.log(
          `%c${name}: %c\n${JSON.stringify(args, null, '  ')}`,
          'color: green; font-weight: bold',
          'color: #00a',
        );
        resolve(resolveTo);
      }, 200);
    });

export default class LogController extends Controller {
  sendTest = promisifiedConsoleLogFactory('sendTest', null);
  getExamples = promisifiedConsoleLogFactory('getExamples', [example1, example2]);
}
