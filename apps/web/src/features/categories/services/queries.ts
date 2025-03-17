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
