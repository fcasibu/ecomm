'use server';

import { addToCartSchema } from '@ecomm/validations/web/cart/add-to-cart-schema';
import { validateAction } from '../utils/action-validator';
import { getServerContext } from '../utils/server-context';
import { cookies } from 'next/headers';
import { cookieKeys } from '../utils/cookie-keys';
import {
  addToCart,
  updateItemDeliveryPromise,
  updateItemQuantity,
} from '@/features/cart/services/mutations';
import { updateItemQuantitySchema } from '@ecomm/validations/web/cart/update-item-quantity-schema';
import type { Locale } from '@ecomm/lib/locale-helper';
import type { CartDTO } from '@ecomm/services/cart/cart-dto';
import { updateDeliveryPromiseSelectionSchema } from '@ecomm/validations/web/cart/update-delivery-promise-selection-schema';

const commonCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
} as const;

async function setCartCookies(locale: Locale, cart: CartDTO): Promise<void> {
  if (!cart.id) {
    return;
  }

  const cookie = await cookies();

  cookie.set(cookieKeys.cart.cartId(locale), cart.id, commonCookieOptions);

  if (cart.anonymousId) {
    cookie.set(
      cookieKeys.customer.anonymousId(locale),
      cart.anonymousId,
      commonCookieOptions,
    );
  }
}

export const addToCartAction = validateAction(addToCartSchema, async (data) => {
  const context = await getServerContext();
  const result = await addToCart(data);

  if (result.success) {
    await setCartCookies(context.locale, result.data);
  }

  return result;
});

export const updateItemQuantityAction = validateAction(
  updateItemQuantitySchema,
  async (data) => {
    const context = await getServerContext();
    const result = await updateItemQuantity(data);

    if (result.success) {
      await setCartCookies(context.locale, result.data);
    }

    return result;
  },
);

export const updateItemDeliveryPromiseAction = validateAction(
  updateDeliveryPromiseSelectionSchema,
  async (data) => {
    const context = await getServerContext();
    const result = await updateItemDeliveryPromise(data);

    if (result.success) {
      await setCartCookies(context.locale, result.data);
    }

    return result;
  },
);
