import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@ecomm/ui/table';
import { QueryPagination } from '@/components/query-pagination';
import { Skeleton } from '@ecomm/ui/skeleton';
import { Suspense } from 'react';
import { PRODUCTS_PAGE_SIZE } from '@/lib/constants';

export function ProductsTableSkeleton() {
  const skeletonItems = Array.from({ length: PRODUCTS_PAGE_SIZE }, (_, i) => i);

  return (
    <div className="space-y-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">SKU</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {skeletonItems.map((_, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">
                <Skeleton className="mb-1 h-5 w-full" />
              </TableCell>
              <TableCell className="max-w-[20ch]">
                <Skeleton className="mb-1 h-5 w-full" />
              </TableCell>
              <TableCell className="max-w-[20ch]">
                <Skeleton className="mb-1 h-5 w-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="mb-1 h-5 w-full" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Suspense>
        <QueryPagination />
      </Suspense>
    </div>
  );
}
