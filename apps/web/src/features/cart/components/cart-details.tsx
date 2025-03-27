import type { CartDTO } from '@ecomm/services/cart/cart-dto';
import { FreeShippingPriceThreshold } from './free-shipping-threshold';
import { CartOrderSummary } from './order-summary';
import { CartHeading } from './cart-heading';
import { CartItems } from './cart-items';

export function CartDetails({ cart }: { cart: CartDTO }) {
  return (
    <div className="container flex flex-col gap-4 py-4">
      <CartHeading itemsCount={cart.items.length} />
      <div className="flex flex-col justify-center gap-4 lg:flex-row">
        <div className="flex flex-1 flex-col gap-4">
          <FreeShippingPriceThreshold currentThreshold={100} />
          <CartItems cart={cart} />
        </div>
        <div className="basis-[450px]">
          <CartOrderSummary cart={cart} />
        </div>
      </div>
    </div>
  );
}
