import { getProducts } from "../services/queries";
import { TypographyH2 } from "@ecomm/ui/typography";
import { QueryPagination } from "@/components/query-pagination";
import { ProductsTableClient } from "./products-table-client";
import { PRODUCTS_PAGE_SIZE } from "@/lib/constants";

export async function ProductsTable({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const where = searchParams.then((sp) => ({
    page: Number(sp.page || "1"),
    query: (sp.q as string) ?? "",
  }));
  const { page = 1, query = "" } = await where;

  const result = await getProducts({
    page,
    query: query.toLowerCase(),
    pageSize: PRODUCTS_PAGE_SIZE,
  });

  if (!result.success) {
    return (
      <TypographyH2>
        Failed to load products. Please try again later.
      </TypographyH2>
    );
  }

  if (!result.data.totalCount) {
    return <TypographyH2>No products found.</TypographyH2>;
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
