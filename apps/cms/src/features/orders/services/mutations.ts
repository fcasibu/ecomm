"use server";

import "server-only";
import { executeOperation } from "@ecomm/lib/execute-operation";
import { ordersController } from "@ecomm/services/registry";
import type {
  OrderCreateInput,
  OrderUpdateInput,
} from "@ecomm/validations/cms/orders/orders-schema";
import { revalidateTag } from "next/cache";

export const createOrder = async (input: OrderCreateInput) => {
  const result = await executeOperation(() => ordersController.create(input));

  if (result.success) {
    revalidateTag("orders");
    revalidateTag("order");
  }

  return result;
};

export const updateOrderById = async (
  orderId: string,
  input: OrderUpdateInput,
) => {
  const result = await executeOperation(() =>
    ordersController.update(orderId, input),
  );

  if (result.success) {
    revalidateTag("orders");
    revalidateTag("order");
  }

  return result;
};
