import { BaseError } from "./base-error";

export class ImageUploadError extends BaseError {
  constructor(message: string) {
    super(`Image upload error: ${message}`);

    this.name = "ImageUploadError";
  }
}
