import 'server-only';
import { categoriesController } from '@ecomm/services/registry';
import { executeOperation } from '@ecomm/lib/execute-operation';
import { unstable_cacheTag as cacheTag } from 'next/cache';

export async function getRootCategories(locale: string) {
  'use cache';

  cacheTag('root_categories');

  return await executeOperation(() =>
    categoriesController().getRootCategories(locale),
  );
}

export async function getCategoriesHierarchy(locale: string, ids: string[]) {
  'use cache';

  cacheTag('categories_hierarchy');

  return await executeOperation(() =>
    categoriesController().getHierarhchyOfCategoryIds(locale, ids),
  );
}

export async function getNonRootCategories(locale: string) {
  'use cache';

  cacheTag('non_root_categories');

  return await executeOperation(() =>
    categoriesController().getAllNonRootCategories(locale),
  );
}
