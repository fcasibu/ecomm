import "server-only";
import { categoriesController } from "@ecomm/services/registry";
import { executeOperation } from "@ecomm/lib/execute-operation";
import { unstable_cacheTag as cacheTag } from "next/cache";

export const getCategories = async (input: {
  page?: number;
  query?: string;
  pageSize?: number;
}) => {
  "use cache";
  cacheTag("categories");

  return executeOperation(() => categoriesController.getAll(input));
};

export const getRootCategories = async () => {
  "use cache";
  cacheTag("root_categories");

  return executeOperation(() => categoriesController.getRootCategories());
};

export const getCategoryById = async (id: string) => {
  "use cache";
  cacheTag("category");

  return executeOperation(() => categoriesController.getById(id));
};
