import type { CartDTO } from '@ecomm/services/cart/cart-dto';
import type { StoreDTO } from '@ecomm/services/store/store-dto';

export function getCartShippingFee(store: StoreDTO, cart: CartDTO) {
  const priceNeeded = Math.max(store.freeShippingThreshold - cart.subtotal, 0);

  return cart.items
    .flatMap((item) => item.deliveryPromises.filter((dp) => dp.selected))
    .reduce((acc, dp) => {
      const isFree = !dp.requiresShippingFee && priceNeeded === 0;
      const nonRequiredShippingFee = isFree ? 0 : dp.price;

      return acc + (dp.requiresShippingFee ? dp.price : nonRequiredShippingFee);
    }, 0);
}
