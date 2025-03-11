import { BaseError } from "./base-error";

export class InvalidImageFormatError extends BaseError {
  constructor(type: string) {
    super(`Invalid image format: ${type}`);

    this.name = "InvalidImageFormatError";
  }
}
