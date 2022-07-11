/**
 * A helper class to declare and mock a function of the controller
 */
export default class MockControllerFunction<TInput, TOutput, TError = Error> {
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

    resolve(this.resolveTo.default);
  }
}
