import type { CartDTO } from '@ecomm/services/cart/cart-dto';
import type { StoreDTO } from '@ecomm/services/store/store-dto';
import { getCartShippingFee } from './get-cart-shipping-fee';

export function getCartTotal(store: StoreDTO, cart: CartDTO) {
  return cart.subtotal + getCartShippingFee(store, cart);
}
