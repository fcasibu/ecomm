'use server';

import { executeOperation } from '@ecomm/lib/execute-operation';
import { cartController } from '@ecomm/services/registry';
import type { CartCreateInput } from '@ecomm/validations/cms/cart/cart-schema';

export const createCart = async (locale: string, input: CartCreateInput) => {
  const result = await executeOperation(() =>
    cartController().create(locale, input),
  );

  return result;
};
