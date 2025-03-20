import 'server-only';
import { executeOperation } from '@ecomm/lib/execute-operation';
import { storeController } from '@ecomm/services/registry';
import { unstable_cacheTag as cacheTag } from 'next/cache';

export const getStoreByLocale = async (locale: string) => {
  'use cache';

  cacheTag('store', `store_${locale}`);

  return await executeOperation(() => storeController().getByLocale(locale));
};
