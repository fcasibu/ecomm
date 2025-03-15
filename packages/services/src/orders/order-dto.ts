import type { OrderStatus } from "@ecomm/db";
import type { AddressDTO } from "../customers/customer-dto";

export interface OrderItemDTO {
  id: string;
  sku: string;
  image: string;
  name: string;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderDTO {
  id: string;
  totalAmount: number;
  currency: string;
  status: OrderStatus;
  items: OrderItemDTO[];
  customer: {
    email: string;
    addresses: AddressDTO[];
  };
  createdAt: string;
  updatedAt: string;
}
