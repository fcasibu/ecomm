import { algoliaWriteClient } from '@/features/algolia/algolia-write-client';
import { getProductsWithAssociatedCategory } from '@/features/products/services/queries';
import { getCurrentLocale } from '@/locales/server';
import { isDefined } from '@ecomm/lib/is-defined';
import { NextResponse } from 'next/server';
import assert from 'node:assert';

const client = algoliaWriteClient();

// TODO(fcasibu): make it secure
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

  const indexName = `${envName}_products_${locale}`;

  client.setSettings({
    indexName,
    indexSettings: {
      searchableAttributes: ['categorySlug'],
      attributesForFaceting: [
        'filterOnly(categorySlug)',
        'attributes.color',
        'attributes.width',
        'price.value',
      ],
    },
  });

  client.partialUpdateObjects({
    indexName,
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
        categorySlug: product.category.slug,
        price: {
          value: variant.price.value,
          currency: variant.price.currency,
        },
        variants: product.variants.map((variant) => ({
          id: variant.id,
          image: variant.images[0],
          sku: variant.sku,
        })),
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
