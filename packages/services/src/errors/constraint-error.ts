import { BaseError } from "./base-error";

export class ConstraintError extends BaseError {
  constructor(message: string) {
    super(message);

    this.name = "ConstraintError";
  }
}
