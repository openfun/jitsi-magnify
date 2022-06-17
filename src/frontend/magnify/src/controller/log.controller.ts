import Controller from './interface';

const promisifiedConsoleLogFactory =
  (name: string) =>
  (...args: any[]): Promise<void> =>
    new Promise((resolve) => {
      setTimeout(() => {
        console.log(
          `%c${name}: %c\n${JSON.stringify(args, null, '  ')}`,
          'color: green; font-weight: bold',
          'color: #00a',
        );
        resolve();
      }, 200);
    });

export default class LogController extends Controller {
  sendTest = promisifiedConsoleLogFactory('sendTest');
}
