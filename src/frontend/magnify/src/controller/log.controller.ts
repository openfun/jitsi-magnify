import { createRandomProfile } from '../factories/profile';
import { Nullable } from '../types/misc';
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
const promisifiedConsoleLogFactory =
  <T, TInput, TError>(
    controller: LogController,
    name: string,
    resolver = new MockControllerFunction<TInput, T, TError>(),
    protectedRoute = true,
  ) =>
  async (args?: any): Promise<T> => {
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

  rejectOnDefault(error: TError) {
    this.rejectTo.default = error;
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

    if (this.rejectTo.default) {
      reject(this.rejectTo.default);
      return;
    }

    if (this.resolveTo.default) {
      resolve(this.resolveTo.default);
      return;
    }
  }
}

export default class LogController extends Controller {
  // mock if the user has a refreshToken, true=>refresh works, false=>refresh fails 403
  refreshActivated = true;

  sendTest = promisifiedConsoleLogFactory(this, 'sendTest');
  getExamples = promisifiedConsoleLogFactory(
    this,
    'getExamples',
    new MockControllerFunction<string, { id: string; name: string }[]>().resolveOnDefault([
      example1,
      example2,
    ]),
  );

  joinRoom = promisifiedConsoleLogFactory(
    this,
    'joinRoom',
    new MockControllerFunction<string, { token: string }>().resolveOnDefault({ token: 'token' }),
  );

  /**
   * Login routes
   */
  login = async (input: LoginInput) => {
    const tokens = await promisifiedConsoleLogFactory(
      this,
      'login',
      new MockControllerFunction<LoginInput, Tokens, Record<string, string>>()
        .resolveOnDefault({ refresh: 'successful-refresh', access: 'successful-access' })
        .rejectOn(
          { username: 'username', password: 'bad-password' },
          { detail: 'InvalidCredentials' },
        ),
      false,
    )(input);
    localStorage.setItem('refresh', tokens.refresh);
    this._jwt = tokens.access;
    this._setStore((pStore): Store => ({ ...pStore, connexionStatus: ConnexionStatus.CONNECTED }));
    return tokens;
  };
  refresh = async (refreshToken: string) => {
    const handler: MockControllerFunction<string, AccessToken, any> = this.refreshActivated
      ? new MockControllerFunction<string, AccessToken>().resolveOnDefault({
          access: 'successful-access',
        })
      : new MockControllerFunction<string, AccessToken, any>().rejectOnDefault({
          detail: 'Given token not valid for any token type',
          code: 'token_not_valid',
          messages: [
            {
              token_class: 'AccessToken',
              token_type: 'access',
              message: 'Token is invalid or expired',
            },
          ],
        });

    const accessToken = await promisifiedConsoleLogFactory(
      this,
      'refresh',
      handler,
      false,
    )(refreshToken);

    this._jwt = accessToken.access;
    this._setStore((pStore): Store => ({ ...pStore, connexionStatus: ConnexionStatus.CONNECTED }));
    return accessToken;
  };

  /**
   * Users routes
   */
  signup = async (input: SignupInput) => {
    const tokens = await promisifiedConsoleLogFactory(
      this,
      'signup',
      new MockControllerFunction<SignupInput, Tokens, Record<string, string>>()
        .resolveOnDefault({
          refresh: 'successful-refresh',
          access: 'successful-access',
        })
        .rejectOn(
          {
            name: 'test',
            email: 'bad-email@test.fr',
            username: 'bad_username',
            password: 'test1234',
          },
          { username: 'Username already taken', email: 'Email already taken' },
        ),
      false,
    )(input);
    localStorage.setItem('refresh', tokens.refresh);
    this._jwt = tokens.access;
    this._setStore((pStore): Store => ({ ...pStore, connexionStatus: ConnexionStatus.CONNECTED }));
    return tokens;
  };
  getMyProfile = async () => {
    const profile = await promisifiedConsoleLogFactory(
      this,
      'getMyProfile',
      new MockControllerFunction<null, Profile>().resolveOnDefault(createRandomProfile()),
    )();
    this._setStore((pStore): Store => ({ ...pStore, user: profile }));
    return profile;
  };
  getUser = promisifiedConsoleLogFactory(
    this,
    'getUser',
    new MockControllerFunction<string, Profile>().resolveOnDefault(createRandomProfile()),
  );
  updateUser = promisifiedConsoleLogFactory(
    this,
    'updateUser',
    new MockControllerFunction<UpdateUserInput, Profile>().resolveOnDefault(createRandomProfile()),
  );
  updateUserAvatar = promisifiedConsoleLogFactory(
    this,
    'updateUserAvatar',
    new MockControllerFunction<UpdateUserAvatarInput, Profile>().resolveOnDefault(
      createRandomProfile(),
    ),
  );
  updateUserPassword = promisifiedConsoleLogFactory(
    this,
    'updateUserPassword',
    new MockControllerFunction<UpdateUserPasswordInput, Profile>().resolveOnDefault(
      createRandomProfile(),
    ),
  );
  deleteUser = promisifiedConsoleLogFactory(
    this,
    'deleteUser',
    new MockControllerFunction<string, void>(),
  );
}
