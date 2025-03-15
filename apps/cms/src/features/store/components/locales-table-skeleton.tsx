import { Skeleton } from "@ecomm/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ecomm/ui/table";

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
    </div>
  );
}
