import { Card, CardHeader, CardFooter, CardContent } from '@ecomm/ui/card';
import { Skeleton } from '@ecomm/ui/skeleton';
import { CATEGORIES_PAGE_SIZE } from '../constants';
import { QueryPagination } from '@/components/query-pagination';
import { Suspense } from 'react';

export function CategoriesCardsSkeleton() {
  const skeletonItems = Array.from(
    { length: CATEGORIES_PAGE_SIZE },
    (_, i) => i,
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {skeletonItems.map((index) => (
          <Card key={index} className="h-full border border-gray-200">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-9 w-9 rounded-md" />
                  <Skeleton className="h-6 w-32" />
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <Skeleton className="mb-1 h-4 w-full" />
              <Skeleton className="mb-4 h-4 w-3/4" />
            </CardContent>

            <CardFooter className="border-t pt-3 text-xs">
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
