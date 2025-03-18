import { logger } from '@ecomm/lib/logger';

interface SuccessResult<T> {
  success: true;
  data: T;
}

interface ErrorResult {
  success: false;
  error: Error;
}

export type SanityResult<T> = SuccessResult<T> | ErrorResult;

export async function executeQuery<T, V>(
  operation: () => Promise<T>,
  transformFn?: (data: T) => V,
): Promise<SanityResult<V extends unknown ? T : V>> {
  try {
    const data = await operation();

    if (!data) {
      return {
        success: false,
        error: new Error('Resource not found'),
      };
    }

    return {
      success: true,
      data: (transformFn ? transformFn(data) : data) as V extends unknown
        ? T
        : V,
    };
  } catch (error) {
    logger.error({ error }, 'Something went wrong with sanity query');

    return {
      success: false,
      error: error as Error,
    };
  }
}
