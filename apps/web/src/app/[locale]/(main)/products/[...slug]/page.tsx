import { ProductDetailPageBreadcrumb } from '@/components/breadcrumbs/product-detail-page-breadcrumb';
import { getCategoriesPath } from '@/features/categories/services/queries';
import { ProductDetail } from '@/features/products/components/product-detail';
import { RecentlyViewedProducts } from '@/features/products/components/recently-viewed-products';
import { RecentlyViewedSetter } from '@/features/products/components/recently-viewed-setter';
import { getProductBySku } from '@/features/products/services/queries';
import { link } from '@/lib/utils/link-helper';
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
  const querySku = (slug[1] || slug[0] || '').toLowerCase();
  const result = await getProductBySku(locale, querySku);

  if (!result.success || !result.data.variants.length) return notFound();

  const baseProductSku = result.data.sku;
  const variantSku = result.data.variants[0]?.sku;
  assert(variantSku, 'variant sku should exist');

  const productSlugs = transformProductSkusToSlugs(result.data);

  if (
    productSlugs.every(
      (productSlug) => productSlug !== `/products/${slug.join('/')}`,
    )
  ) {
    const formattedSlug = productSlugs.find((productSlug) =>
      productSlug.endsWith(querySku),
    );

    assert(formattedSlug, 'formatted slug should exist');

    // TODO(fcasibu): redirect is causing empty content
    return redirect(`/${locale}${formattedSlug}`, RedirectType.replace);
  }

  const categoriesPathResult = result.data.category?.id
    ? await getCategoriesPath(locale, result.data.category.id)
    : null;

  console.log(
    categoriesPathResult?.success
      ? JSON.stringify(categoriesPathResult.data)
      : null,
  );

  return (
    <div className="flex flex-col pb-12">
      {categoriesPathResult?.success && categoriesPathResult.data.length && (
        <ProductDetailPageBreadcrumb data={categoriesPathResult.data} />
      )}
      <ProductDetail product={result.data} selectedSku={querySku} />
      <RecentlyViewedProducts sku={baseProductSku} />
      <RecentlyViewedSetter sku={baseProductSku} />
    </div>
  );
}

function transformProductSkusToSlugs(product: ProductDTO) {
  const baseProductSlug = link.product.single(product.name, product.sku);

  return product.variants
    .map((variant) => link.product.single(product.name, variant.sku))
    .concat(baseProductSlug);
}
