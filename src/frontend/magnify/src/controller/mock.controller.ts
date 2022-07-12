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

  createGroup = jest.fn();
  getGroups = jest.fn();
  getGroup = jest.fn();
  addUserToGroup = jest.fn();

  joinMeeting = jest.fn();
  createMeeting = jest.fn();
  getMeeting = jest.fn();
  getMyMeetings = jest.fn();

  getMyRooms = jest.fn();
  registerRoom = jest.fn();
  addGroupsToRoom = jest.fn();
  getRoomBySlug = jest.fn();
  getRoom = jest.fn();
  updateRoomSettings = jest.fn();
  getRoomPossibleMeetings = jest.fn();
}
