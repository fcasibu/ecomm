import { clientEnv } from '@/env/client';
import { serverEnv } from '@/env/server';
import { getProductsWithAssociatedCategory } from '@/features/products/services/queries';
import { getCurrentLocale } from '@/locales/server';
import { isDefined } from '@ecomm/lib/is-defined';
import { algoliasearch } from 'algoliasearch';
import { NextResponse } from 'next/server';
import assert from 'node:assert';

const client = algoliasearch(
  clientEnv.NEXT_PUBLIC_ALGOLIA_APP_ID,
  serverEnv.ALGOLIA_WRITE_KEY,
);

// TODO(fcasibu): create service for algolia / make it secure
export async function GET() {
  const locale = await getCurrentLocale();
  const result = await getProductsWithAssociatedCategory(locale);

  if (!result.success) {
    return NextResponse.json(result);
  }

  const products = result.data.filter((product) =>
    isDefined(product.variants[0]),
  );

  if (!products.length) {
    return NextResponse.json({ success: true, message: 'No products found' });
  }

  const envName =
    process.env.NODE_ENV === 'production' ? 'production' : 'development';

  client.partialUpdateObjects({
    indexName: `${envName}_products_${locale}`,
    objects: products.map((product) => {
      const variant = product.variants[0];

      assert(variant, 'Product must have a variant');
      assert(product.category?.id, 'Product must have a category');

      return {
        objectID: variant.sku,
        id: product.id,
        name: product.name,
        description: product.description,
        image: variant.images[0],
        sku: variant.sku,
        categoryId: product.category.id,
        price: {
          value: variant.price.value,
          currency: variant.price.currency,
        },
        updatedAt: product.updatedAt,
        createdAt: product.createdAt,
        attributes: variant.attributes,
        deliveryPromises: product.deliveryPromises,
      };
    }),
    createIfNotExists: true,
  });

  return NextResponse.json({
    success: true,
    message: `Synced ${products.length} products`,
  });
}
