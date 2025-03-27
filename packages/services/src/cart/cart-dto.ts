import type { CartStatus } from '@ecomm/db';
import type { DeliveryPromiseShippingMethod } from '../common/types';

export interface CartItemDeliveryPromiseDTO {
  id: string;
  price: number;
  estimatedMinDays: number;
  estimatedMaxDays: number;
  shippingMethod: DeliveryPromiseShippingMethod;
  requiresShippingFee: boolean;
  selected: boolean;
}

export interface CartItemDTO {
  id: string;
  sku: string;
  image: string;
  name: string;
  quantity: number;
  color: string;
  deliveryPromises: CartItemDeliveryPromiseDTO[];
  price: number;
  size: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartDTO {
  id: string;
  customerId: string | null;
  anonymousId: string | null;
  items: CartItemDTO[];
  subtotal: number;
  status: CartStatus;
  createdAt: string;
  updatedAt: string;
}
