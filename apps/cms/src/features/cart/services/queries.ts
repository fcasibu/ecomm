import "server-only";

import { executeOperation } from "@ecomm/lib/execute-operation";
import { cartController } from "@ecomm/services/registry";
import { unstable_cacheTag as cacheTag } from "next/cache";

export const getCartById = async (locale: string, cartId: string) => {
  "use cache";
  cacheTag("all", "cart", `cart_${cartId}`, `store_${locale}`);

  return await executeOperation(() => cartController.getById(locale, cartId));
};
