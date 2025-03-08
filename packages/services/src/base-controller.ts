import { logger } from "@ecomm/lib/logger";
import { ConstraintError } from "./errors/constraint-error";
import { DuplicateError } from "./errors/duplicate-error";
import { NotFoundError } from "./errors/not-found-error";

export class BaseController {
  protected mapError(
    error: unknown,
    options?: {
      message?: string;
      notFoundMessage?: string;
      duplicateMessage?: string;
      constraintMessage?: string;
    },
  ): never {
    switch ((error as { code?: string })?.code) {
      case "P2025": {
        logger.error({ error }, options?.notFoundMessage);
        throw new NotFoundError(options?.notFoundMessage ?? "");
      }
      case "P2002": {
        logger.error({ error }, options?.duplicateMessage);
        throw new DuplicateError(options?.duplicateMessage ?? "");
      }
      case "P2003": {
        logger.error({ error }, options?.constraintMessage);
        throw new ConstraintError(options?.constraintMessage ?? "");
      }
    }

    logger.error({ error }, options?.message);
    throw error;
  }
}
