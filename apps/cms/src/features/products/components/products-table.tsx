import { getProducts } from '../services/queries';
import { Heading } from '@ecomm/ui/typography';
import { QueryPagination } from '@/components/query-pagination';
import { ProductsTableClient } from './products-table-client';
import { PRODUCTS_PAGE_SIZE } from '@/lib/constants';
import { getCookieCurrentLocale } from '@/lib/get-cookie-current-locale';

export async function ProductsTable({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const where = searchParams.then((sp) => ({
    page: Number(sp.page || '1'),
    query: (sp.q as string) ?? '',
  }));
  const { page = 1, query = '' } = await where;

  const locale = await getCookieCurrentLocale();
  const result = await getProducts(locale, {
    page,
    query: query.toLowerCase(),
    pageSize: PRODUCTS_PAGE_SIZE,
  });

  if (!result.success) {
    return (
      <Heading as="h2">
        Failed to load products. Please try again later.
      </Heading>
    );
  }

  if (!result.data.totalCount) {
    return <Heading as="h2">No products found.</Heading>;
  }

  const { products, totalCount } = result.data;

  const totalPages = Math.ceil(totalCount / PRODUCTS_PAGE_SIZE);

  return (
    <div className="space-y-6">
      <ProductsTableClient products={products} />
      <QueryPagination totalPages={totalPages} />
    </div>
  );
}
