'use server';

import 'server-only';
import { categoriesController } from '@ecomm/services/registry';
import type {
  CategoryCreateInput,
  CategoryUpdateInput,
} from '@ecomm/validations/cms/categories/category-schema';
import { executeOperation } from '@ecomm/lib/execute-operation';
import { revalidateTag } from 'next/cache';

export const createCategory = async (
  locale: string,
  input: CategoryCreateInput,
) => {
  const result = await executeOperation(() =>
    categoriesController().create(locale, input),
  );

  if (result.success) {
    revalidateTag('categories');
    revalidateTag('root_categories');
    revalidateTag('category');
    revalidateTag('categories_path');
    revalidateTag('product');
    revalidateTag('products');
  }

  return result;
};

export const deleteCategoryById = async (
  locale: string,
  categoryId: string,
) => {
  const result = await executeOperation(() =>
    categoriesController().delete(locale, categoryId),
  );

  if (result.success) {
    revalidateTag('categories');
    revalidateTag('root_categories');
    revalidateTag('category');
    revalidateTag('categories_path');
    revalidateTag('product');
    revalidateTag('products');
  }

  return result;
};

export const updateCategoryById = async (
  locale: string,
  categoryId: string,
  input: CategoryUpdateInput,
) => {
  const result = await executeOperation(() =>
    categoriesController().update(locale, categoryId, input),
  );

  if (result.success) {
    revalidateTag('categories');
    revalidateTag('root_categories');
    revalidateTag('category');
    revalidateTag('categories_path');
    revalidateTag('product');
    revalidateTag('products');
  }

  return result;
};
