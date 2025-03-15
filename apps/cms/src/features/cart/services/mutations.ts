'use server';

import 'server-only';
import { executeOperation } from '@ecomm/lib/execute-operation';
import { cartController } from '@ecomm/services/registry';
import type {
  CartCreateInput,
  CartUpdateInput,
} from '@ecomm/validations/cms/cart/cart-schema';
import { revalidateTag } from 'next/cache';

export const createCart = async (locale: string, input: CartCreateInput) => {
  const result = await executeOperation(() =>
    cartController().create(locale, input),
  );

  return result;
};

export const updateCartById = async (
  locale: string,
  cartId: string,
  input: CartUpdateInput,
) => {
  const result = await executeOperation(() =>
    cartController().update(locale, cartId, input),
  );

  if (result.success) {
    revalidateTag('orders');
    revalidateTag('order');
    revalidateTag('cart');
  }

  return result;
};
