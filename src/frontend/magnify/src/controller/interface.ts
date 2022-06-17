export default abstract class Controller {
  abstract sendTest(message: string): Promise<any>;
  abstract getExamples(): Promise<{ id: string; name: string }[]>;
}
