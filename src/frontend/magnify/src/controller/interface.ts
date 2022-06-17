export default abstract class Controller {
  abstract sendTest(message: string): Promise<any>;
}
