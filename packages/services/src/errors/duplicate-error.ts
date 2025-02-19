import { BaseError } from "./base-error";

export class DuplicateError extends BaseError {
  constructor(message: string) {
    super(message);

    this.name = "DuplicateError";
  }
}
