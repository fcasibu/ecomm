import { getCategories } from '@/features/categories/services/queries';
import { Heading } from '@ecomm/ui/typography';
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from '@ecomm/ui/card';
import Link from 'next/link';
import { ChevronRightIcon, LayersIcon } from 'lucide-react';
import { QueryPagination } from '@/components/query-pagination';
import { CATEGORIES_PAGE_SIZE } from '@/lib/constants';
import { getCookieCurrentLocale } from '@/lib/get-cookie-current-locale';

export async function CategoriesCards({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const locale = await getCookieCurrentLocale();
  const where = searchParams.then((sp) => ({
    page: Number(sp.page || '1'),
    query: (sp.q as string) ?? '',
  }));
  const { page = 1, query = '' } = await where;
  const result = await getCategories(locale, {
    page,
    query: query.toLowerCase(),
    pageSize: CATEGORIES_PAGE_SIZE,
  });

  if (!result.success) {
    return (
      <Heading as="h2">
        Failed to load categories. Please try again later.
      </Heading>
    );
  }

  if (!result.data.totalCount) {
    return <Heading as="h2">No categories found.</Heading>;
  }

  const { categories, totalCount } = result.data;

  const totalPages = Math.ceil(totalCount / CATEGORIES_PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link
            href={`/categories/${category.id}`}
            key={category.id}
            className="transition-all hover:shadow-md focus:shadow-md focus:outline-none"
          >
            <Card className="h-full border border-gray-200 hover:border-blue-300">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="rounded-md bg-gray-100 p-2">
                      <LayersIcon className="h-5 w-5 text-gray-700" />
                    </div>
                    <CardTitle className="text-lg font-medium">
                      {category.name}
                    </CardTitle>
                  </div>
                  <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                </div>
              </CardHeader>

              <CardContent>
                <CardDescription className="mb-2 line-clamp-2 h-10">
                  {category.description || 'No description available'}
                </CardDescription>
              </CardContent>

              <CardFooter className="flex justify-between border-t pt-3 text-xs text-gray-500">
                <div>Slug: {category.slug}</div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
      <QueryPagination totalPages={totalPages} />
    </div>
  );
}
