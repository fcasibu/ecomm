'use client';

import type { CartDTO } from '@ecomm/services/cart/cart-dto';
import { CartItem } from './cart-item';
import { updateItemQuantityAction } from '@/lib/actions/cart';
import { useActionState } from 'react';
import { useStore } from '@/features/store/providers/store-provider';
import { ShippingMethods } from './shipping-methods';

export function CartItems({ cart }: { cart: CartDTO }) {
  const [result, formAction, isPending] = useActionState(
    updateItemQuantityAction,
    cart ? { success: true, data: cart } : null,
  );
  const store = useStore();

  const cartData = result?.success ? result.data : cart;
  const sortedCartItems =
    cartData?.items.toSorted(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    ) ?? [];

  return (
    <form className="flex flex-col">
      {sortedCartItems.map((item, index) => (
        <div key={item.id}>
          <CartItem
            item={item}
            currency={store.currency}
            formAction={formAction}
            isPending={isPending}
          />
          <ShippingMethods item={item} subtotal={cart.subtotal} />
          {index < sortedCartItems.length - 1 && <hr className="my-8" />}
        </div>
      ))}
    </form>
  );
}
