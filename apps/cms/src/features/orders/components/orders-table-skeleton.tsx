import { ORDERS_PAGE_SIZE } from '@/lib/constants';
import { Skeleton } from '@ecomm/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@ecomm/ui/table';

export function OrdersTableSkeleton() {
  const skeletonItems = Array.from({ length: ORDERS_PAGE_SIZE });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[140px]">Status</TableHead>
          <TableHead>Order total</TableHead>
          <TableHead>Created at</TableHead>
          <TableHead>Updated at</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {skeletonItems.map((_, index) => (
          <TableRow key={index}>
            <TableCell className="max-w-[140px] truncate">
              <Skeleton className="mb-1 h-5 w-full" />
            </TableCell>
            <TableCell>
              <Skeleton className="mb-1 h-5 w-full" />
            </TableCell>
            <TableCell>
              <Skeleton className="mb-1 h-5 w-full" />
            </TableCell>
            <TableCell>
              <Skeleton className="mb-1 h-5 w-full" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
