import { OrdersTable } from '@/features/orders/components/orders-table';
import { OrdersTableSkeleton } from '@/features/orders/components/orders-table-skeleton';
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
        Orders
      </Heading>
      <div>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/orders/create" className="mb-4 min-w-[220px]">
              Create
            </Link>
          </Button>
        </div>
      </div>
      <div className="mb-4"></div>
      <Suspense fallback={<OrdersTableSkeleton />}>
        <OrdersTable searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
