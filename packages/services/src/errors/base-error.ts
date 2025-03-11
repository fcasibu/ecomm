export class BaseError extends Error {
  constructor(public override readonly message: string) {
    super(message);

    Error.captureStackTrace(this, this.constructor);
  }
}
