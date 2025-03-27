import { BaseTransformer } from '../base-transformer';
import type { CartDTO, CartItemDTO } from './cart-dto';
import type { Cart } from './cart-service';

export class CartTransformer extends BaseTransformer {
  public toDTO(cart: Cart | null | undefined): CartDTO | null {
    if (!cart) return null;

    const items = cart.items.map((item) => this.transformCartItem(item));

    const subtotal = items.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);

    return {
      id: cart.id,
      customerId: cart.customerId,
      anonymousId: cart.anonymousId,
      subtotal,
      status: cart.status,
      items,
      createdAt: this.formatDateToISO(cart.createdAt),
      updatedAt: this.formatDateToISO(cart.updatedAt),
    };
  }

  private transformCartItem(item: Cart['items'][number]): CartItemDTO {
    return {
      id: item.id,
      sku: item.sku,
      quantity: item.quantity,
      price: item.price.toNumber(),
      color: item.color,
      size: item.size,
      image: item.image,
      deliveryPromises: item.deliveryPromises.map((dp, index) => ({
        id: dp.id,
        price: dp.price.toNumber(),
        shippingMethod: dp.shippingMethod,
        estimatedMinDays: dp.estimatedMinDays,
        estimatedMaxDays: dp.estimatedMaxDays,
        requiresShippingFee: dp.requiresShippingFee ?? false,
        selected: dp.selected ?? index === 0,
      })),
      name: item.name,
      createdAt: this.formatDateToISO(item.createdAt),
      updatedAt: this.formatDateToISO(item.updatedAt),
    };
  }
}
