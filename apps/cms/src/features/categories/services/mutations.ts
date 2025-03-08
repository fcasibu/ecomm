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
    revalidateTag("root_categories");
    revalidateTag("category");
    revalidateTag("categories_path");
  }

  return result;
};

export const deleteCategoryById = async (categoryId: string) => {
  const result = await executeOperation(() =>
    categoriesController.delete(categoryId),
  );

  if (result.success) {
    revalidateTag("categories");
    revalidateTag("root_categories");
    revalidateTag("category");
    revalidateTag("categories_path");
  }

  return result;
};

export const updateCategoryById = async (
  categoryId: string,
  input: CategoryUpdateInput,
) => {
  const result = await executeOperation(() =>
    categoriesController.update(categoryId, input),
  );

  if (result.success) {
    revalidateTag("categories");
    revalidateTag("root_categories");
    revalidateTag("category");
    revalidateTag("categories_path");
  }

  return result;
};
