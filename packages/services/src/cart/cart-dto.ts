import type { CartStatus } from "@ecomm/db";

export interface CartItemDTO {
  id: string;
  sku: string;
  image: string;
  name: string;
  quantity: number;
  price: number;
  stock: number;
  currencyCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartDTO {
  id: string;
  customerId: string | null;
  anonymousId: string | null;
  items: CartItemDTO[];
  totalAmount: number;
  status: CartStatus;
  createdAt: string;
  updatedAt: string;
}
