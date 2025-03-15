import 'server-only';
import { executeOperation } from '@ecomm/lib/execute-operation';
import { storeController } from '@ecomm/services/registry';
import {
  unstable_cacheTag as cacheTag,
  unstable_cacheLife as cacheLife,
} from 'next/cache';

export const getStoreByLocale = async (locale: string) => {
  'use cache';
  cacheTag('all', 'store', `store_${locale}`);
  cacheLife('max');

  return await executeOperation(() => storeController().getByLocale(locale));
};

export const getStores = async (input: {
  page?: number;
  query?: string;
  pageSize?: number;
}) => {
  'use cache';
  cacheTag('all', 'stores');
  cacheLife('max');

  return await executeOperation(() => storeController().getAll(input));
};
