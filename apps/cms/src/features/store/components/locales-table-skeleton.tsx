import { Skeleton } from '@ecomm/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@ecomm/ui/table';

export function LocalesTableSkeleton() {
  const skeletonItems = Array.from({ length: 10 });
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Locale</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Currency</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {skeletonItems.map((_, index) => (
            <TableRow key={index}>
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
    </div>
  );
}
