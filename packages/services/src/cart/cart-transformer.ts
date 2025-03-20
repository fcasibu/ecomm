import assert from 'node:assert';
import { BaseTransformer } from '../base-transformer';
import type { CartDTO, CartItemDTO } from './cart-dto';
import type { Cart } from './cart-service';

export class CartTransformer extends BaseTransformer {
  public toDTO(cart: Cart | null | undefined): CartDTO | null {
    if (!cart) return null;

    return {
      id: cart.id,
      customerId: cart.customerId,
      anonymousId: cart.anonymousId,
      totalAmount: cart.totalAmount.toNumber(),
      status: cart.status,
      items: cart.items.map((item) => this.transformCartItem(item)),
      createdAt: this.formatDateToISO(cart.createdAt),
      updatedAt: this.formatDateToISO(cart.updatedAt),
    };
  }

  private transformCartItem(item: Cart['items'][number]): CartItemDTO {
    const variant = item.product.variants.find(
      (variant) => variant.sku === item.sku,
    );

    assert(variant, 'variant should always be defined');
    assert(variant.images[0], 'variant should always have an image defined');

    return {
      id: item.id,
      sku: item.sku,
      quantity: item.quantity,
      price: variant.price.toNumber(),
      size: item.size,
      image: variant.images[0],
      name: item.product.name,
      createdAt: this.formatDateToISO(item.createdAt),
      updatedAt: this.formatDateToISO(item.updatedAt),
    };
  }
}
