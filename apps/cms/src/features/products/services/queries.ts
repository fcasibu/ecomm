import { executeOperation } from "@ecomm/lib/execute-operation";
import { productsController } from "@ecomm/services/registry";
import { unstable_cacheTag as cacheTag } from "next/cache";
import "server-only";

export const getProductById = async (id: string) => {
  "use cache";
  cacheTag("all", "product", `product_${id}`);

  return await executeOperation(() => productsController.getById(id));
};

export const getProducts = async (input: {
  page?: number;
  query?: string;
  pageSize?: number;
}) => {
  "use cache";
  cacheTag("all", "products");

  return await executeOperation(() => productsController.getAll(input));
};
