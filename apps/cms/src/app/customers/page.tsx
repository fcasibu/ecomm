import { QuerySearch } from "@/components/query-search";
import { QuerySearchSkeleton } from "@/components/query-search-skeleton";
import { CustomersTable } from "@/features/customers/components/customers-table";
import { CustomersTableSkeleton } from "@/features/customers/components/customers-table-skeleton";
import { Button } from "@ecomm/ui/button";
import { TypographyH1 } from "@ecomm/ui/typography";
import Link from "next/link";
import { Suspense } from "react";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <div>
      <TypographyH1 className="mb-8">Customers</TypographyH1>
      <div>
        <div className="flex gap-2 flex-wrap">
          <Button asChild>
            <Link href="/customers/create" className="mb-4 min-w-[220px]">
              Create
            </Link>
          </Button>
        </div>
      </div>
      <div className="mb-4">
        <Suspense fallback={<QuerySearchSkeleton />}>
          <QuerySearch />
        </Suspense>
      </div>
      <Suspense fallback={<CustomersTableSkeleton />}>
        <CustomersTable searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
