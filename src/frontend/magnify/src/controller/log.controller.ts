import { createRandomProfile } from '../factories/profile';
import { Profile } from '../types/profile';
import { AccessToken, Tokens } from '../types/tokens';
import Controller, {
  LoginInput,
  SignupInput,
  UpdateUserAvatarInput,
  UpdateUserInput,
  UpdateUserPasswordInput,
} from './interface';
import { example1, example2 } from './mocks/example';

interface MockResolver<T> extends Record<string, T> {
  default: T;
}

type MockRejecter<T> = Record<string, T>;

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
const promisifiedConsoleLogFactory =
  <T, TInput, TError>(name: string, resolver = new MockControllerFunction<TInput, T, TError>()) =>
  (args?: any): Promise<T> =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        // 1) Log the call to the console.
        console.log(
          `%c${name}: %c\n${JSON.stringify(args, null, '  ')}`,
          'color: green; font-weight: bold',
          'color: #00a',
        );

        resolver.run(args, resolve, reject);
      }, 700);
    });

/**
 * A helper class to declare and mock a function of the controller
 */
class MockControllerFunction<TInput, TOutput, TError = Error> {
  private resolveTo: Record<string, TOutput> = {};
  private rejectTo: Record<string, TError> = {};

  constructor() {}

  resolveOnDefault(output: TOutput) {
    this.resolveTo.default = output;
    return this;
  }

  resolveOn(param: TInput, output: TOutput) {
    this.resolveTo[JSON.stringify(param)] = output;
    return this;
  }

  rejectOn(param: TInput, error: TError) {
    this.rejectTo[JSON.stringify(param)] = error;
    return this;
  }

  run(
    param: TInput,
    resolve: (value: TOutput | PromiseLike<TOutput>) => void,
    reject: (reason?: any) => void,
  ): void {
    if (JSON.stringify(param) in this.rejectTo) {
      reject(this.rejectTo[JSON.stringify(param)]);
      return;
    }

    if (JSON.stringify(param) in this.resolveTo) {
      resolve(this.resolveTo[JSON.stringify(param)]);
      return;
    }

    if (this.resolveTo.default) {
      resolve(this.resolveTo.default);
      return;
    }
  }
}

export default class LogController extends Controller {
  sendTest = promisifiedConsoleLogFactory('sendTest');
  getExamples = promisifiedConsoleLogFactory(
    'getExamples',
    new MockControllerFunction<string, { id: string; name: string }[]>().resolveOnDefault([
      example1,
      example2,
    ]),
  );

  joinRoom = promisifiedConsoleLogFactory(
    'joinRoom',
    new MockControllerFunction<string, { token: string }>().resolveOnDefault({ token: 'token' }),
  );

  /**
   * Login routes
   */
  login = promisifiedConsoleLogFactory(
    'login',
    new MockControllerFunction<LoginInput, Tokens>()
      .resolveOnDefault({ refresh: 'successful-refresh', access: 'successful-access' })
      .rejectOn({ username: 'username', password: 'bad-password' }, Error('InvalidCredentials')),
  );
  refresh = promisifiedConsoleLogFactory(
    'refresh',
    new MockControllerFunction<string, AccessToken>().resolveOnDefault({
      access: 'successful-access',
    }),
  );

  /**
   * Users routes
   */
  signup = promisifiedConsoleLogFactory(
    'signup',
    new MockControllerFunction<SignupInput, Tokens>().resolveOnDefault({
      refresh: 'successful-refresh',
      access: 'successful-access',
    }),
  );
  getMyProfile = promisifiedConsoleLogFactory(
    'getMyProfile',
    new MockControllerFunction<null, Profile>().resolveOnDefault(createRandomProfile()),
  );
  getUser = promisifiedConsoleLogFactory(
    'getUser',
    new MockControllerFunction<string, Profile>().resolveOnDefault(createRandomProfile()),
  );
  updateUser = promisifiedConsoleLogFactory(
    'updateUser',
    new MockControllerFunction<UpdateUserInput, Profile>().resolveOnDefault(createRandomProfile()),
  );
  updateUserAvatar = promisifiedConsoleLogFactory(
    'updateUserAvatar',
    new MockControllerFunction<UpdateUserAvatarInput, Profile>().resolveOnDefault(
      createRandomProfile(),
    ),
  );
  updateUserPassword = promisifiedConsoleLogFactory(
    'updateUserPassword',
    new MockControllerFunction<UpdateUserPasswordInput, Profile>().resolveOnDefault(
      createRandomProfile(),
    ),
  );
  deleteUser = promisifiedConsoleLogFactory(
    'deleteUser',
    new MockControllerFunction<string, void>(),
  );
}
