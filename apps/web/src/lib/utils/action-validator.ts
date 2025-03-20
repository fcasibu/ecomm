/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Result } from '@ecomm/lib/execute-operation';
import type { z, ZodSchema } from 'zod';

interface ActionErrorResult<T extends ZodSchema> {
  success: false;
  error: { [key in keyof z.infer<T>]: { _errors: string[] } };
}

type ActionFunction<T, U> = (arg: T) => Promise<U>;
type ActionResult<T, U extends ZodSchema> = T | ActionErrorResult<U>;

export function validateAction<T extends Result<any>, U extends ZodSchema>(
  schema: U,
  action: ActionFunction<z.infer<U>, T>,
): (
  _prevState: any,
  arg: z.infer<U> | FormData,
) => Promise<ActionResult<T, U> | null> {
  return async (_prevState: any, arg: z.infer<U> | FormData) => {
    const parsedArg = arg instanceof FormData ? Object.fromEntries(arg) : arg;

    const validationResult = await schema.safeParseAsync(parsedArg);

    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.format(),
      } as ActionErrorResult<U>;
    }

    return await action(validationResult.data);
  };
}
