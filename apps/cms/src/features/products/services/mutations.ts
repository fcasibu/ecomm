"use server";

import { executeOperation } from "@ecomm/lib/execute-operation";
import { productsController } from "@ecomm/services/registry";
import type { ProductCreateInput } from "@ecomm/validations/products/product-schema";
import { revalidateTag } from "next/cache";
import "server-only";

export const createProduct = async (input: ProductCreateInput) => {
  const result = await executeOperation(() => productsController.create(input));

  if (result.success) {
    revalidateTag("products");
    revalidateTag("product");
  }

  return result;
};
