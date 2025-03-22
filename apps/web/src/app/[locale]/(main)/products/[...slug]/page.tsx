import { ProductDetail } from '@/features/products/components/product-detail';
import { RecentlyViewedProducts } from '@/features/products/components/recently-viewed-products';
import { RecentlyViewedSetter } from '@/features/products/components/recently-viewed-setter';
import { getProductBySku } from '@/features/products/services/queries';
import { slugify } from '@ecomm/lib/transformers';
import { setStaticParamsLocale } from 'next-international/server';
import { notFound, redirect, RedirectType } from 'next/navigation';

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}) {
  const { slug, locale } = await params;
  setStaticParamsLocale(locale);
  const querySku = (slug[1] ?? slug[0] ?? '').toLowerCase();
  const result = await getProductBySku(locale, querySku);

  if (!result.success || !result.data.variants.length) return notFound();

  const sku = result.data.sku;
  const transformedProductSlug =
    `${slugify(result.data.name)}/${sku}`.toLowerCase();

  if (transformedProductSlug !== slug.join('/'))
    return redirect(
      `/${locale}/products/${transformedProductSlug}`,
      RedirectType.replace,
    );

  return (
    <div className="flex flex-col gap-8 pb-12">
      <ProductDetail product={result.data} selectedSku={sku} />
      <RecentlyViewedProducts sku={sku} />
      <RecentlyViewedSetter sku={sku} />
    </div>
  );
}
