import { CUSTOMERS_PAGE_SIZE } from "@/lib/constants";
import { Skeleton } from "@ecomm/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ecomm/ui/table";

export function CustomersTableSkeleton() {
  const skeletonItems = Array.from({ length: CUSTOMERS_PAGE_SIZE });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[140px]">User ID</TableHead>
          <TableHead>First name</TableHead>
          <TableHead>Last name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Created at</TableHead>
          <TableHead>Updated at</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {skeletonItems.map((_, index) => (
          <TableRow key={index}>
            <TableCell className="max-w-[140px] truncate">
              <Skeleton className="h-5 w-full mb-1" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-full mb-1" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-full mb-1" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-full mb-1" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-full mb-1" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-full mb-1" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
