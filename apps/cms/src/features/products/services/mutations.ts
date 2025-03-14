"use server";

import { executeOperation } from "@ecomm/lib/execute-operation";
import { productsController } from "@ecomm/services/registry";
import type {
  ProductCreateInput,
  ProductUpdateInput,
} from "@ecomm/validations/cms/products/product-schema";
import { revalidateTag } from "next/cache";
import "server-only";

export const createProduct = async (input: ProductCreateInput) => {
  const result = await executeOperation(() => productsController.create(input));

  if (result.success) {
    revalidateTag("products");
    revalidateTag("product");
    revalidateTag("categories");
    revalidateTag("category");
    revalidateTag("root_categories");
    revalidateTag("categories_path");
  }

  return result;
};

export const updateProductById = async (
  id: string,
  input: ProductUpdateInput,
) => {
  const result = await executeOperation(() =>
    productsController.update(id, input),
  );

  if (result.success) {
    revalidateTag("products");
    revalidateTag("product");
    revalidateTag("categories");
    revalidateTag("category");
    revalidateTag("root_categories");
    revalidateTag("categories_path");
  }

  return result;
};

export const deleteProductById = async (id: string) => {
  const result = await executeOperation(() => productsController.delete(id));

  if (result.success) {
    revalidateTag("products");
    revalidateTag("product");
    revalidateTag("categories");
    revalidateTag("category");
    revalidateTag("root_categories");
    revalidateTag("categories_path");
  }

  return result;
};
