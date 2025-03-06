import { BaseError } from "./base-error";

export class MaxTierReachedError extends BaseError {
  constructor(maxTier: number) {
    super(
      `Max tier of ${maxTier} has been reached. A category cannot be higher than tier ${maxTier}`,
    );

    this.name = "MaxTierReachedError";
  }
}
