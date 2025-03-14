import { QuerySearch } from "@/components/query-search";
import { QuerySearchSkeleton } from "@/components/query-search-skeleton";
import { ProductsTable } from "@/features/products/components/products-table";
import { ProductsTableSkeleton } from "@/features/products/components/products-table-skeleton";
import { Button } from "@ecomm/ui/button";
import { Heading } from "@ecomm/ui/typography";
import Link from "next/link";
import { Suspense } from "react";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <div>
      <Heading as="h1" className="mb-8">
        Products
      </Heading>
      <div>
        <div className="flex gap-2 flex-wrap">
          <Button asChild>
            <Link href="/products/create" className="mb-4 min-w-[220px]">
              Create
            </Link>
          </Button>
        </div>
      </div>
      <div className="mb-4">
        <Suspense fallback={<QuerySearchSkeleton />}>
          <QuerySearch label="Search products" />
        </Suspense>
      </div>
      <Suspense fallback={<ProductsTableSkeleton />}>
        <ProductsTable searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
