"use server";

import "server-only";
import { categoriesController } from "@ecomm/services/registry";
import type {
  CategoryCreateInput,
  CategoryUpdateInput,
} from "@ecomm/validations/categories/category-schema";
import { executeOperation } from "@ecomm/lib/execute-operation";
import { revalidateTag } from "next/cache";

export const createCategory = async (input: CategoryCreateInput) => {
  const result = await executeOperation(() =>
    categoriesController.create(input),
  );

  if (result.success) {
    revalidateTag("categories");
  }

  return result;
};

export const updateCategoryById = async (
  categoryId: string,
  input: CategoryUpdateInput,
) => {
  return executeOperation(() => categoriesController.update(categoryId, input));
};

export const deleteCategoryById = async (categoryId: string) => {
  return executeOperation(() => categoriesController.delete(categoryId));
};
