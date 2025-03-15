'use server';

import 'server-only';
import { executeOperation } from '@ecomm/lib/execute-operation';
import { ordersController } from '@ecomm/services/registry';
import type {
  OrderCreateInput,
  OrderUpdateInput,
} from '@ecomm/validations/cms/orders/orders-schema';
import { revalidateTag } from 'next/cache';

export const createOrder = async (locale: string, input: OrderCreateInput) => {
  const result = await executeOperation(() =>
    ordersController.create(locale, input),
  );

  if (result.success) {
    revalidateTag('orders');
    revalidateTag('order');
  }

  return result;
};

export const updateOrderById = async (
  locale: string,
  orderId: string,
  input: OrderUpdateInput,
) => {
  const result = await executeOperation(() =>
    ordersController.update(locale, orderId, input),
  );

  if (result.success) {
    revalidateTag('orders');
    revalidateTag('order');
  }

  return result;
};
