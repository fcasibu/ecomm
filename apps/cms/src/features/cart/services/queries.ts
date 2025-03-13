import "server-only";

import { executeOperation } from "@ecomm/lib/execute-operation";
import { cartController } from "@ecomm/services/registry";
import { unstable_cacheTag as cacheTag } from "next/cache";

export const getCartById = async (cartId: string) => {
  "use cache";
  cacheTag("all", "cart", `cart_${cartId}`);

  return await executeOperation(() => cartController.getById(cartId));
};
