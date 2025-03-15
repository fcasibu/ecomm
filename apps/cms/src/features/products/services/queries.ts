import { executeOperation } from '@ecomm/lib/execute-operation';
import { productsController } from '@ecomm/services/registry';
import { unstable_cacheTag as cacheTag } from 'next/cache';
import 'server-only';

export const getProductById = async (locale: string, id: string) => {
  'use cache';
  cacheTag('all', 'product', `product_${id}`, `store_${locale}`);

  return await executeOperation(() => productsController().getById(locale, id));
};

export const getProducts = async (
  locale: string,
  input: {
    page?: number;
    query?: string;
    pageSize?: number;
  },
) => {
  'use cache';
  cacheTag('all', 'products', `store_${locale}`);

  return await executeOperation(() =>
    productsController().getAll(locale, input),
  );
};
