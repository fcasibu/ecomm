import { logger } from "@ecomm/lib/logger";
import { ConstraintError } from "./errors/constraint-error";
import { DuplicateError } from "./errors/duplicate-error";
import { NotFoundError } from "./errors/not-found-error";

export interface ErrorOptions {
  message?: string;
  notFoundMessage?: string;
  duplicateMessage?: string;
  constraintMessage?: string;
}

export class BaseController {
  protected mapError(
    error: unknown,
    options?: ErrorOptions,
  ): never {
    const prismaError = error as { code?: string; meta?: { target?: string[] } };
    
    switch (prismaError?.code) {
      case "P2025": {
        logger.error({ error }, options?.notFoundMessage);
        throw new NotFoundError(options?.notFoundMessage ?? "Resource not found");
      }
      case "P2002": {
        const target = prismaError.meta?.target?.join(", ") ?? "";
        const message = options?.duplicateMessage ?? `Duplicate entry for ${target}`;
        logger.error({ error }, message);
        throw new DuplicateError(message);
      }
      case "P2003": {
        const message = options?.constraintMessage ?? "Operation violates constraints";
        logger.error({ error }, message);
        throw new ConstraintError(message);
      }
    }

    logger.error({ error }, options?.message);
    throw error;
  }
}
