import { Card, CardHeader, CardFooter, CardContent } from "@ecomm/ui/card";
import { Skeleton } from "@ecomm/ui/skeleton";
import { PAGE_SIZE } from "./categories-table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@ecomm/ui/pagination";

export function CategoriesTableSkeleton() {
  const skeletonItems = Array.from({ length: PAGE_SIZE }, (_, i) => i);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skeletonItems.map((index) => (
          <Card key={index} className="h-full border border-gray-200">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-9 w-9 rounded-md" />
                  <Skeleton className="h-6 w-32" />
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4 mb-4" />
            </CardContent>

            <CardFooter className="text-xs border-t pt-3">
              <Skeleton className="h-3 w-28" />
            </CardFooter>
          </Card>
        ))}
      </div>

      <Pagination className="my-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              aria-disabled
              href="#"
              className="pointer-events-none"
            >
              <div className="flex items-center gap-1 opacity-70">
                <span>Previous</span>
              </div>
            </PaginationPrevious>
          </PaginationItem>

          {[1, 2, 3].map((num) => (
            <PaginationItem key={num}>
              <PaginationLink href="#" className="pointer-events-none">
                <Skeleton className="h-4 w-4" />
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              aria-disabled
              href="#"
              className="pointer-events-none"
            >
              <div className="flex items-center gap-1 opacity-70">
                <span>Next</span>
              </div>
            </PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
