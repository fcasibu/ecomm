import { ProductDetail } from '@/features/products/components/product-detail';
import { RecentlyViewedProducts } from '@/features/products/components/recently-viewed-products';
import { RecentlyViewedSetter } from '@/features/products/components/recently-viewed-setter';
import { getProductBySku } from '@/features/products/services/queries';
import { slugify } from '@ecomm/lib/transformers';
import type { ProductDTO } from '@ecomm/services/products/product-dto';
import { setStaticParamsLocale } from 'next-international/server';
import { notFound, redirect, RedirectType } from 'next/navigation';
import assert from 'node:assert';

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}) {
  const { slug, locale } = await params;
  setStaticParamsLocale(locale);
  const querySku = slug[1] ?? slug[0] ?? '';
  const result = await getProductBySku(locale, querySku);

  if (!result.success || !result.data.variants.length) return notFound();

  const baseProductSku = result.data.sku;
  const variantSku = result.data.variants[0]?.sku;
  assert(variantSku, 'variant sku must be present');

  const productSlugs = transformProductSkusToSlugs(result.data);
  const joinedSlug = slug.join('/');

  if (productSlugs.every((productSlug) => productSlug !== joinedSlug)) {
    const formattedSlug = productSlugs.find((productSlug) =>
      productSlug.endsWith(querySku),
    );
    assert(formattedSlug, 'formatted slug should exist');

    return redirect(formattedSlug, RedirectType.replace);
  }

  return (
    <div className="flex flex-col gap-8 pb-12">
      <ProductDetail product={result.data} selectedSku={querySku} />
      <RecentlyViewedProducts sku={baseProductSku} />
      <RecentlyViewedSetter sku={baseProductSku} />
    </div>
  );
}

function transformProductSkusToSlugs(product: ProductDTO) {
  const baseProductSlug =
    `${slugify(product.name)}/${product.sku}`.toLowerCase();

  return product.variants
    .map((variant) => `${slugify(product.name)}/${variant.sku}`.toLowerCase())
    .concat(baseProductSlug);
}
