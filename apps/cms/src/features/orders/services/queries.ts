import "server-only";

import { executeOperation } from "@ecomm/lib/execute-operation";
import { ordersController } from "@ecomm/services/registry";
import { unstable_cacheTag as cacheTag } from "next/cache";

export const getOrderById = async (locale: string, orderId: string) => {
  "use cache";
  cacheTag("all", "order", `order_${orderId}`, `store_${locale}`);

  return await executeOperation(() =>
    ordersController.getById(locale, orderId),
  );
};

export const getOrders = async (
  locale: string,
  input: {
    page?: number;
    pageSize?: number;
  },
) => {
  "use cache";
  cacheTag("all", "orders", `store_${locale}`);

  return await executeOperation(() => ordersController.getAll(locale, input));
};
