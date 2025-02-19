import { CategoriesTable } from "@/features/categories/components/categories-table";
import { CategoriesTableSkeleton } from "@/features/categories/components/categories-table-skeleton";
import { CategorySearch } from "@/features/categories/components/category-search";
import { CategorySearchSkeleton } from "@/features/categories/components/category-search-skeleton";
import { Button } from "@ecomm/ui/button";
import { TypographyH1 } from "@ecomm/ui/typography";
import Link from "next/link";
import { Suspense } from "react";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const where = searchParams.then((sp) => ({
    page: Number(sp.page || "1"),
    query: sp.q as string,
  }));

  return (
    <div>
      <TypographyH1 className="mb-8">Categories</TypographyH1>
      <div>
        <div className="flex gap-2 flex-wrap">
          <Button asChild>
            <Link href="/categories/create" className="mb-4 min-w-[220px]">
              Create
            </Link>
          </Button>
          <Button asChild>
            <Link href="#" className="mb-4 min-w-[220px]">
              Generate Category with AI
            </Link>
          </Button>
        </div>
        <div className="mb-4">
          <Suspense fallback={<CategorySearchSkeleton />}>
            <CategorySearch />
          </Suspense>
        </div>
        <Suspense fallback={<CategoriesTableSkeleton />}>
          <CategoriesTable where={where} />
        </Suspense>
      </div>
    </div>
  );
}
