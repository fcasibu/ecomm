import "server-only";
import { categoriesController } from "@ecomm/services/registry";
import { executeOperation } from "@ecomm/lib/execute-operation";
import { unstable_cacheTag as cacheTag } from "next/cache";

export const getCategoriesPath = async (categoryId: string) => {
  "use cache";
  cacheTag("all", "categories_path");

  return executeOperation(() =>
    categoriesController.getCategoriesPath(categoryId),
  );
};

export const getCategories = async (input: {
  page?: number;
  query?: string;
  pageSize?: number;
}) => {
  "use cache";
  cacheTag("all", "categories");

  return executeOperation(() => categoriesController.getAll(input));
};

export const getRootCategories = async () => {
  "use cache";
  cacheTag("all", "root_categories");

  return executeOperation(() => categoriesController.getRootCategories());
};

export const getCategoryById = async (id: string) => {
  "use cache";
  cacheTag("all", "category", `category_${id}`);

  return executeOperation(() => categoriesController.getById(id));
};
