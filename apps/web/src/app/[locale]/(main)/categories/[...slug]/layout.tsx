import { InstantSearchCategoryProvider } from '@/features/algolia/providers/instant-search-category-provider';
import { InstantSearchProductProvider } from '@/features/algolia/providers/instant-search-product-provider';
import { ProductFiltersBuilder } from '@/features/algolia/utils/filters';
import { notFound } from 'next/navigation';

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string[] }>;
}) {
  const categorySlug = (await params).slug[0];

  if (!categorySlug) return notFound();

  const productsFilters = new ProductFiltersBuilder()
    .addCategorySlug(categorySlug)
    .build();

  return (
    <InstantSearchCategoryProvider>
      <InstantSearchProductProvider filters={productsFilters}>
        {children}
      </InstantSearchProductProvider>
    </InstantSearchCategoryProvider>
  );
}
