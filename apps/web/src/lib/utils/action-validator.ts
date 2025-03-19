import { logger } from '@ecomm/lib/logger';
import type { ZodError, ZodSchema } from 'zod';

interface SuccessResult<T> {
  success: true;
  data: T;
}

interface ErrorResult {
  success: false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: ZodError<any> | unknown;
}

type ActionResult<T> = SuccessResult<T> | ErrorResult;

export function validateAction<
  T extends ZodSchema | FormData,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  U extends (arg: T) => Promise<any>,
>(
  schema: ZodSchema,
  action: U,
): (
  _prevState: ActionResult<Awaited<ReturnType<U>>>,
  arg: T,
) => Promise<ActionResult<Awaited<ReturnType<U>>>> {
  return async (_prevState: ActionResult<Awaited<ReturnType<U>>>, arg: T) => {
    try {
      const input = await schema.safeParseAsync(
        arg instanceof FormData ? Object.fromEntries(arg) : arg,
      );

      if (!input.success) {
        return {
          success: false,
          error: input.error,
        };
      }

      const result = await action(input.data);

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      logger.error({ error }, `Action call failed for ${action.name}`);
      return {
        success: false,
        error,
      };
    }
  };
}
