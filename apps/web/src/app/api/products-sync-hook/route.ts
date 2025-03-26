import { algoliaWriteClient } from '@/features/algolia/algolia-write-client';
import { getProductsWithAssociatedCategory } from '@/features/products/services/queries';
import { getCurrentLocale } from '@/locales/server';
import type { ProductDTO } from '@ecomm/services/products/product-dto';
import { NextResponse } from 'next/server';
import assert from 'node:assert';

const client = algoliaWriteClient();

function transformProductForAlgolia(product: ProductDTO) {
  const variant = product.variants[0];
  assert(variant, 'Product must have a variant');
  assert(product.category?.id, 'Product must have a category');

  return {
    objectID: variant.sku,
    id: product.id,
    name: product.name,
    description: product.description,
    image: variant.images[0] || '',
    sku: variant.sku,
    categorySlug: product.category.slug,
    price: {
      value: variant.price.value,
      currency: variant.price.currency,
    },
    variants: product.variants.map((variant) => ({
      id: variant.id,
      image: variant.images[0] || '',
      sku: variant.sku,
    })),
    updatedAt: product.updatedAt,
    createdAt: product.createdAt,
    attributes: variant.attributes,
    deliveryPromises: product.deliveryPromises,
  };
}

async function syncProductsToAlgolia(locale: string, products: any[]) {
  const envName =
    process.env.NODE_ENV === 'production' ? 'production' : 'development';
  const indexName = `${envName}_products_${locale}`;
  const createVirtualIndexName = (strategy: string) =>
    `${envName}_products_${strategy}_${locale}`;

  try {
    await client.setSettings({
      indexName,
      forwardToReplicas: true,
      indexSettings: {
        searchableAttributes: ['categorySlug'],
        attributesForFaceting: [
          'filterOnly(categorySlug)',
          'attributes.color',
          'attributes.width',
          'price.value',
        ],
        replicas: [
          createVirtualIndexName('price_asc'),
          createVirtualIndexName('price_desc'),
        ],
      },
    });

    await client.setSettings({
      indexName: createVirtualIndexName('price_asc'),
      indexSettings: {
        customRanking: ['asc(price.value)'],
      },
    });

    await client.setSettings({
      indexName: createVirtualIndexName('price_desc'),
      indexSettings: {
        customRanking: ['desc(price.value)'],
      },
    });

    const objects = products
      .map(transformProductForAlgolia)
      .filter((obj) => obj !== null);

    if (objects.length === 0) {
      return { success: true, message: 'No valid products to sync' };
    }

    await client.partialUpdateObjects({
      indexName,
      objects,
      createIfNotExists: true,
    });

    return { success: true, message: `Synced ${objects.length} products` };
  } catch (error) {
    console.error('Error syncing products to Algolia:', error);
    return { success: false, error: 'Failed to sync products to Algolia' };
  }
}

// TODO(fcasibu): make it secure
export async function GET() {
  const locale = await getCurrentLocale();
  const result = await getProductsWithAssociatedCategory(locale);

  if (!result.success) {
    return NextResponse.json(result);
  }

  const products = result.data;
  if (products.length === 0) {
    return NextResponse.json({ success: true, message: 'No products found' });
  }

  const syncResult = await syncProductsToAlgolia(locale, products);
  return NextResponse.json(syncResult);
}
