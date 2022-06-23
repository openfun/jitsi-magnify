export default abstract class Controller {
  // False routes, just to try the controller mechanism.
  abstract sendTest(message: string): Promise<any>;
  abstract getExamples(): Promise<{ id: string; name: string }[]>;

  // True routes, to be implemented by the controller.
  abstract joinRoom(roomId: string): Promise<{ token: string }>;
}
