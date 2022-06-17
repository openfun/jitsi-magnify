import Controller from './interface';

export default class MockController extends Controller {
  sendTest = jest.fn();
}
