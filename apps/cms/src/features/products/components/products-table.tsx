import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ecomm/ui/table";
import { getProducts } from "../services/queries";
import { PRODUCTS_PAGE_SIZE } from "@/features/categories/constants";
import { TypographyH2 } from "@ecomm/ui/typography";
import { QueryPagination } from "@/components/query-pagination";

export async function ProductsTable({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const where = searchParams.then((sp) => ({
    page: Number(sp.page || "1"),
    query: sp.q as string,
  }));
  const { page = 1, query = "" } = (await where) ?? {};

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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[140px]">SKU</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">
                {product.variants[0]?.sku}
              </TableCell>
              <TableCell className="max-w-[20ch] truncate">
                {product.name}
              </TableCell>
              <TableCell className="max-w-[20ch] truncate">
                {product.description}
              </TableCell>
              <TableCell>{product.category?.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <QueryPagination totalPages={totalPages} />
    </div>
  );
}
