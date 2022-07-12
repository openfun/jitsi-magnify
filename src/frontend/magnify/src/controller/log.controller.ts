import createRandomGroup from '../factories/group';
import createRandomGroups from '../factories/groups';
import { createMeetingInProgress, createRandomMeeting } from '../factories/meeting';
import { createRandomProfile } from '../factories/profile';
import createRandomRoom from '../factories/room';
import createRandomRooms from '../factories/rooms';
import withToken from '../factories/withToken';
import { Group } from '../types/group';
import { Meeting } from '../types/meeting';
import { Profile } from '../types/profile';
import { Room } from '../types/room';
import { AccessToken, Tokens } from '../types/tokens';
import { WithToken } from '../types/withToken';
import Controller, {
  AddGroupsToRoomInput,
  AddUserToGroupInput,
  CreateGroupInput,
  CreateMeetingInput,
  LoginInput,
  SignupInput,
  UpdateRoomSettingsInput,
  UpdateUserAvatarInput,
  UpdateUserInput,
  UpdateUserPasswordInput,
} from './interface';
import MockControllerFunction from './MockControllerFunction';
import { example1, example2 } from './mocks/example';
import promisifiedConsoleLogFactoryGeneric from './promisifiedConsoleLogFactory';
import { ConnexionStatus, Store } from './store';
import createRandomMeetings from '../factories/meetings';

/**
 * At first, this function seems to do nothing more than the promisifiedConsoleLogFactoryGeneric
 * But we can't use it directly. If we specifiy only "Controller" as the type of controller, or even
 * if we add a generic "TController extends Controller", the compiler will complain that we are not
 * typing the function correctly, because we pass this without typing it. Therefore we need to type
 * explicitely the first argument as "LogController". But we can't do it from the other file without
 * a circular dependency. Therefore, we use this definition to type the controller.
 */
function promisifiedConsoleLogFactory<T, TInput, TError>(
  controller: LogController,
  name: string,
  resolver = new MockControllerFunction<TInput, T, TError>(),
  protectedRoute = true,
): (args?: any) => Promise<T> {
  return promisifiedConsoleLogFactoryGeneric(controller, name, resolver, protectedRoute);
}

export default class LogController extends Controller {
  // mock if the user has a refreshToken, true=>refresh works, false=>refresh fails 403
  refreshActivated = true;
  testToken: string;

  constructor(testToken: string) {
    super();
    this.testToken = testToken;
  }

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
  getRoomPossibleMeetings = (roomSlug: string) =>
    promisifiedConsoleLogFactory(
      this,
      'getRoomPossibleMeetings',
      new MockControllerFunction<string, WithToken<Meeting>[], { detail: string }>()
        .resolveOnDefault([withToken(createMeetingInProgress(), this.testToken)])
        .resolveOn('my-room-with-no-meetings', [])
        .resolveOn('my-room-with2-meetings', [
          withToken(createMeetingInProgress(), this.testToken),
          withToken(createMeetingInProgress(), this.testToken),
        ])
        .rejectOn('my-innexistant-room', { detail: 'Room not found' }),
    )(roomSlug);

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
  updateUser = async (input: UpdateUserInput) => {
    const profile = await promisifiedConsoleLogFactory(
      this,
      'updateUser',
      new MockControllerFunction<UpdateUserInput, Profile>().resolveOnDefault(
        createRandomProfile(),
      ),
    )(input);
    this._setStore((pStore): Store => ({ ...pStore, user: profile }));
    return profile;
  };
  updateUserAvatar = async (input: UpdateUserAvatarInput) => {
    const profile = await promisifiedConsoleLogFactory(
      this,
      'updateUserAvatar',
      new MockControllerFunction<UpdateUserAvatarInput, Profile>().resolveOnDefault(
        createRandomProfile(),
      ),
    )(input);
    this._setStore((pStore): Store => ({ ...pStore, user: profile }));
    return profile;
  };
  updateUserPassword = async (input: UpdateUserPasswordInput) => {
    const profile = await promisifiedConsoleLogFactory(
      this,
      'updateUserPassword',
      new MockControllerFunction<UpdateUserPasswordInput, Profile>().resolveOnDefault(
        createRandomProfile(),
      ),
    )(input);
    this._setStore((pStore): Store => ({ ...pStore, user: profile }));
    return profile;
  };
  deleteUser = async (id: string) => {
    await promisifiedConsoleLogFactory(
      this,
      'deleteUser',
      new MockControllerFunction<string, void>(),
    )(id);
    console.log('User deleted');
    localStorage.removeItem('refresh');
    this._jwt = null;
    this._setStore({ user: null, connexionStatus: ConnexionStatus.DISCONNECTED });
  };

  // Groups routes
  createGroup = async (input: CreateGroupInput) =>
    promisifiedConsoleLogFactory(
      this,
      'createGroup',
      new MockControllerFunction<CreateGroupInput, Group>().resolveOnDefault({
        ...createRandomGroup(5),
        ...input,
      }),
    )(input);
  getGroups = promisifiedConsoleLogFactory(
    this,
    'getGroups',
    new MockControllerFunction<null, Group[]>().resolveOnDefault(createRandomGroups(7)),
  );
  getGroup = promisifiedConsoleLogFactory(
    this,
    'getGroup',
    new MockControllerFunction<string, Group>().resolveOnDefault(createRandomGroup(6)),
  );
  addUserToGroup = (input: AddUserToGroupInput) =>
    promisifiedConsoleLogFactory(
      this,
      'addUserToGroup',
      new MockControllerFunction<AddUserToGroupInput, Group>().resolveOnDefault(
        createRandomGroup(7),
      ),
    )(input);

  // Meetings
  joinMeeting = promisifiedConsoleLogFactory(
    this,
    'joinMeeting',
    new MockControllerFunction<string, { token: string }>().resolveOnDefault({ token: 'token' }),
  );
  createMeeting = promisifiedConsoleLogFactory(
    this,
    'createMeeting',
    new MockControllerFunction<CreateMeetingInput, Meeting>().resolveOnDefault(
      createRandomMeeting(),
    ),
  );
  getMeeting = (meetingId: string) =>
    promisifiedConsoleLogFactory(
      this,
      'getMeeting',
      new MockControllerFunction<string, WithToken<Meeting>>().resolveOnDefault(
        withToken(createRandomMeeting(), this.testToken),
      ),
    )(meetingId);
  getMyMeetings = promisifiedConsoleLogFactory(
    this,
    'getMyMeetings',
    new MockControllerFunction<null, Meeting[]>().resolveOnDefault(createRandomMeetings(5)),
  );

  // Rooms
  getMyRooms = promisifiedConsoleLogFactory(
    this,
    'getMyRooms',
    new MockControllerFunction<null, Room[]>().resolveOnDefault(createRandomRooms(7, 3)),
  );
  registerRoom = async (name: string) =>
    promisifiedConsoleLogFactory(
      this,
      'registerRoom',
      new MockControllerFunction<string, Room>().resolveOnDefault({
        ...createRandomRoom(true),
        name,
      }),
    )(name);
  addGroupsToRoom = async ({ roomSlug, groupIds }: AddGroupsToRoomInput) => {
    const resolvedRoom = createRandomRoom(true);
    console.log(resolvedRoom, createRandomGroups(groupIds.length));
    resolvedRoom.groups = [...resolvedRoom.groups, ...createRandomGroups(groupIds.length)];
    return await promisifiedConsoleLogFactory(
      this,
      'addGroupsToRoom',
      new MockControllerFunction<AddGroupsToRoomInput, Room>().resolveOnDefault(resolvedRoom),
    )({ roomSlug, groupIds });
  };
  getRoom = promisifiedConsoleLogFactory(
    this,
    'getRoom',
    new MockControllerFunction<string, Room, Record<string, string>>()
      .resolveOnDefault(createRandomRoom())
      .rejectOn('bad-name', { detail: 'InvalidRoomName' }),
  );
  updateRoomSettings = async (input: UpdateRoomSettingsInput) => {
    const room = createRandomRoom();
    return await promisifiedConsoleLogFactory(
      this,
      'updateRoomSettings',
      new MockControllerFunction<UpdateRoomSettingsInput, Room>().resolveOnDefault({
        ...room,
        settings: { ...room.settings, ...input.roomSettings },
      }),
    )(input);
  };
  getRoomBySlug = (roomSlug: string) =>
    promisifiedConsoleLogFactory(
      this,
      'getRoomBySlug',
      new MockControllerFunction<string, WithToken<Room>>().resolveOnDefault(
        withToken(createRandomRoom(), this.testToken),
      ),
    )(roomSlug);
}
