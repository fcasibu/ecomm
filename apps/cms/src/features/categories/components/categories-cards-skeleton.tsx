import { Card, CardHeader, CardFooter, CardContent } from "@ecomm/ui/card";
import { Skeleton } from "@ecomm/ui/skeleton";
import { CATEGORIES_PAGE_SIZE } from "../constants";
import { QueryPagination } from "@/components/query-pagination";
import { Suspense } from "react";

export function CategoriesCardsSkeleton() {
  const skeletonItems = Array.from(
    { length: CATEGORIES_PAGE_SIZE },
    (_, i) => i,
  );

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

      <Suspense>
        <QueryPagination />
      </Suspense>
    </div>
  );
}
