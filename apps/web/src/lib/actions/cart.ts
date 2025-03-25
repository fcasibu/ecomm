'use server';

import { addToCartSchema } from '@ecomm/validations/web/cart/add-to-cart-schema';
import { validateAction } from '../utils/action-validator';
import { cartController } from '@ecomm/services/registry';
import { executeOperation } from '@ecomm/lib/execute-operation';
import { getServerContext } from '../utils/server-context';
import { cookies } from 'next/headers';
import { cookieKeys } from '../utils/cookie-keys';

export const addToCart = validateAction(addToCartSchema, async (data) => {
  const context = await getServerContext();
  const result = await executeOperation(() =>
    cartController().addToCart(data, context),
  );

  // TODO(fcasibu): build an abstraction
  if (result.success) {
    const cookie = await cookies();

    cookie.set(cookieKeys.cart.cartId(context.locale), result.data.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    if (result.data.anonymousId) {
      cookie.set(
        cookieKeys.customer.anonymousId(context.locale),
        result.data.anonymousId,
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        },
      );
    }
  }

  return result;
});
