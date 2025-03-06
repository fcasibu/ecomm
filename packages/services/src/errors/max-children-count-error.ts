import { BaseError } from "./base-error";

export class MaxCategoryChildrenCountError extends BaseError {
  constructor() {
    super(
      "Max count of category children has been reached. A category cannot have more than 12 children.",
    );

    this.name = "MaxCategoryChildrenCountError";
  }
}
