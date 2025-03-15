import 'server-only';
import { categoriesController } from '@ecomm/services/registry';
import { executeOperation } from '@ecomm/lib/execute-operation';
import { unstable_cacheTag as cacheTag } from 'next/cache';

export const getCategoriesPath = async (locale: string, categoryId: string) => {
  'use cache';
  cacheTag('all', 'categories_path', `store_${locale}`);

  return await executeOperation(() =>
    categoriesController().getCategoriesPath(locale, categoryId),
  );
};

export const getCategories = async (
  locale: string,
  input: {
    page?: number;
    query?: string;
    pageSize?: number;
  },
) => {
  'use cache';
  cacheTag('all', 'categories', `store_${locale}`);

  return await executeOperation(() =>
    categoriesController().getAll(locale, input),
  );
};

export const getRootCategories = async (locale: string) => {
  'use cache';
  cacheTag('all', 'root_categories', `store_${locale}`);

  return await executeOperation(() =>
    categoriesController().getRootCategories(locale),
  );
};

export const getCategoryById = async (locale: string, id: string) => {
  'use cache';
  cacheTag('all', 'category', `category_${id}`, `store_${locale}`);

  return await executeOperation(() =>
    categoriesController().getById(locale, id),
  );
};
