import { CategoryContentPage } from '@/components/content-page';
import { ProductListing } from '@/features/categories/components/product-listing';
import { getCategoryBySlug } from '@/features/categories/services/queries';
import { getCurrentLocale } from '@/locales/server';
import { getCategoryContentPage } from '@/sanity/queries/content-page/get-content-page';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const categorySlug = (await params).slug[0];
  const locale = await getCurrentLocale();

  if (!categorySlug) return notFound();

  const [contentPageResult, categoryResult] = await Promise.all([
    getCategoryContentPage(locale, categorySlug),
    getCategoryBySlug(locale, categorySlug),
  ]);

  if (contentPageResult.success) {
    return (
      <CategoryContentPage
        contentPage={contentPageResult.data}
        category={categoryResult.success ? categoryResult.data : null}
      />
    );
  }

  if (!categoryResult.success) return notFound();

  return <ProductListing category={categoryResult.data} />;
}
