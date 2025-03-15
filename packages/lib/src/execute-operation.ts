export type AppErrorCode =
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'DUPLICATE_ERROR'
  | 'INTERNAL_ERROR'
  | 'MAX_TIER_REACHED_ERROR'
  | 'CONSTRAINT_ERROR'
  | 'INVALID_IMAGE_FORMAT'
  | 'IMAGE_UPLOAD_ERROR';

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
      case 'ValidationError':
        return {
          message: error.message,
          code: 'VALIDATION_ERROR',
        };
      case 'NotFoundError':
        return {
          message: error.message,
          code: 'NOT_FOUND',
        };
      case 'DuplicateError':
        return {
          message: error.message,
          code: 'DUPLICATE_ERROR',
        };
      case 'MaxTierReachedError':
        return {
          message: error.message,
          code: 'MAX_TIER_REACHED_ERROR',
        };
      case 'ConstraintError':
        return {
          message: error.message,
          code: 'CONSTRAINT_ERROR',
        };
      case 'InvalidImageFormatError':
        return {
          message: error.message,
          code: 'INVALID_IMAGE_FORMAT',
        };
      case 'ImageUploadError':
        return {
          message: error.message,
          code: 'IMAGE_UPLOAD_ERROR',
        };
      default:
        return {
          message: error.message,
          code: 'INTERNAL_ERROR',
        };
    }
  }

  return {
    message: 'An unexpected error occurred',
    code: 'INTERNAL_ERROR',
  };
}

export async function executeOperation<T>(
  operation: () => Promise<T>,
): Promise<Result<T>> {
  try {
    const data = await operation();

    if (!data) {
      return {
        success: false,
        error: { message: 'No data found', code: 'NOT_FOUND' },
      };
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: mapErrorToAppError(error),
    };
  }
}
