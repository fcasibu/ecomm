export type AppErrorCode =
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "DUPLICATE_ERROR"
  | "INTERNAL_ERROR";

export interface AppError {
  message: string;
  code: AppErrorCode;
}

export interface SuccessResult<T> {
  success: true;
  data: T;
}

export interface ErrorResult {
  success: false;
  error: AppError;
}

export type Result<T> = SuccessResult<T> | ErrorResult;

export function mapErrorToAppError(error: unknown): AppError {
  if (error instanceof Error) {
    switch (error.name) {
      case "ValidationError":
        return {
          message: error.message,
          code: "VALIDATION_ERROR",
        };
      case "NotFoundError":
        return {
          message: error.message,
          code: "NOT_FOUND",
        };
      case "DuplicateError":
        return {
          message: error.message,
          code: "DUPLICATE_ERROR",
        };
      default:
        return {
          message: error.message,
          code: "INTERNAL_ERROR",
        };
    }
  }

  return {
    message: "An unexpected error occurred",
    code: "INTERNAL_ERROR",
  };
}

export async function executeOperation<T>(
  operation: () => Promise<T>,
): Promise<Result<T>> {
  try {
    const data = await operation();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: mapErrorToAppError(error),
    };
  }
}
