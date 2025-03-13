import "server-only";

import { executeOperation } from "@ecomm/lib/execute-operation";
import { ordersController } from "@ecomm/services/registry";
import { unstable_cacheTag as cacheTag } from "next/cache";

export const getOrderById = async (orderId: string) => {
  "use cache";
  cacheTag("all", "order", `order_${orderId}`);

  return await executeOperation(() => ordersController.getById(orderId));
};

export const getOrders = async (input: {
  page?: number;
  pageSize?: number;
}) => {
  "use cache";
  cacheTag("all", "orders");

  return await executeOperation(() => ordersController.getAll(input));
};
