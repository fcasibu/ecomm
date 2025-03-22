import 'server-only';
import { executeOperation } from '@ecomm/lib/execute-operation';
import { productsController } from '@ecomm/services/registry';
import { unstable_cacheTag as cacheTag } from 'next/cache';

export async function getProductBySku(locale: string, sku: string) {
  'use cache';

  cacheTag('product', `product_${sku}`);

  return await executeOperation(() =>
    productsController().getBySku(locale, sku),
  );
}

export async function getProductsBySkus(locale: string, skus: string[]) {
  'use cache';

  cacheTag('product', ...skus.map((sku) => `product_${sku}`));

  return await executeOperation(() =>
    productsController().getProductsBySkus(locale, skus),
  );
}
