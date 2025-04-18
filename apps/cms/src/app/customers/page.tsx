import { QuerySearch } from '@/components/query-search';
import { QuerySearchSkeleton } from '@/components/query-search-skeleton';
import { CustomersTable } from '@/features/customers/components/customers-table';
import { CustomersTableSkeleton } from '@/features/customers/components/customers-table-skeleton';
import { Button } from '@ecomm/ui/button';
import { Heading } from '@ecomm/ui/typography';
import Link from 'next/link';
import { Suspense } from 'react';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <div>
      <Heading as="h1" className="mb-8">
        Customers
      </Heading>
      <div>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/customers/create" className="mb-4 min-w-[220px]">
              Create
            </Link>
          </Button>
        </div>
      </div>
      <div className="mb-4">
        <Suspense fallback={<QuerySearchSkeleton />}>
          <QuerySearch label="Search by email" />
        </Suspense>
      </div>
      <Suspense fallback={<CustomersTableSkeleton />}>
        <CustomersTable searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
