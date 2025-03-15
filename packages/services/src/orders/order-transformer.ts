import { BaseTransformer } from '../base-transformer';
import type { AddressDTO } from '../customers/customer-dto';
import type { OrderDTO, OrderItemDTO } from './order-dto';
import type { Order } from './orders-service';

export class OrderTransformer extends BaseTransformer {
  public toDTO(order: Order | null | undefined): OrderDTO | null {
    if (!order) return null;

    return {
      id: order.id,
      totalAmount: order.totalAmount.toNumber(),
      status: order.status,
      items: order.items.map((item) => this.transformerOrderItem(item)),
      customer: {
        email: order.customer?.email ?? '',
        addresses:
          order.customer?.addresses.map((address) =>
            this.transformAddress(address),
          ) ?? [],
      },
      createdAt: this.formatDateToISO(order.createdAt),
      updatedAt: this.formatDateToISO(order.updatedAt),
    };
  }

  private transformerOrderItem(item: Order['items'][number]): OrderItemDTO {
    return {
      id: item.id,
      sku: item.sku,
      image: item.image,
      name: item.name,
      quantity: item.quantity,
      price: item.price.toNumber(),
      createdAt: this.formatDateToISO(item.createdAt),
      updatedAt: this.formatDateToISO(item.updatedAt),
    };
  }

  private transformAddress(
    address: NonNullable<Order['customer']>['addresses'][number],
  ): AddressDTO {
    return {
      id: address.id,
      type: address.type,
      street: address.street,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      createdAt: this.formatDateToISO(address.createdAt),
      updatedAt: this.formatDateToISO(address.updatedAt),
    };
  }
}
