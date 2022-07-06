import Controller from './interface';

export default class MockController extends Controller {
  sendTest = jest.fn();
  getExamples = jest.fn();

  joinRoom = jest.fn();

  login = jest.fn();
  refresh = jest.fn();

  signup = jest.fn();
  getMyProfile = jest.fn();
  getUser = jest.fn();
  updateUser = jest.fn();
  updateUserAvatar = jest.fn();
  updateUserPassword = jest.fn();
  deleteUser = jest.fn();

  getGroups = jest.fn();

  joinMeeting = jest.fn();

  getMyRooms = jest.fn();
  registerRoom = jest.fn();
  addGroupsToRoom = jest.fn();
}
