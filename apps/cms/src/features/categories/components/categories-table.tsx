import { getCategories } from "@/features/categories/services/queries";
import { TypographyH2 } from "@ecomm/ui/typography";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "@ecomm/ui/card";
import Link from "next/link";
import { ChevronRightIcon, LayersIcon } from "lucide-react";
import { CategoriesPagination } from "./categories-pagination";
import { PAGE_SIZE } from "../constants";

export async function CategoriesTable({
  where,
}: {
  where?: Promise<{ page?: number; query?: string }>;
}) {
  const { page = 1, query = "" } = (await where) ?? {};
  const result = await getCategories({
    page,
    query: query.toLowerCase(),
    pageSize: PAGE_SIZE,
  });

  if (!result.success) {
    return (
      <TypographyH2>
        Failed to load categories. Please try again later.
      </TypographyH2>
    );
  }

  if (!result.data.totalCount) {
    return <TypographyH2>No categories found.</TypographyH2>;
  }

  const { categories, totalCount } = result.data;

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link
            href={`/categories/${category.id}`}
            key={category.id}
            className="transition-all hover:shadow-md focus:shadow-md focus:outline-none"
          >
            <Card className="h-full border border-gray-200 hover:border-blue-300">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <div className="bg-gray-100 p-2 rounded-md">
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
                <CardDescription className="line-clamp-2 h-10 mb-2">
                  {category.description || "No description available"}
                </CardDescription>
              </CardContent>

              <CardFooter className="text-xs text-gray-500 flex justify-between border-t pt-3">
                <div>Slug: {category.slug}</div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
      <CategoriesPagination totalPages={totalPages} />
    </div>
  );
}
