import { CategoriesCards } from "@/features/categories/components/categories-cards";
import { CategoriesCardsSkeleton } from "@/features/categories/components/categories-cards-skeleton";
import { QuerySearch } from "@/components/query-search";
import { QuerySearchSkeleton } from "@/components/query-search-skeleton";
import { Button } from "@ecomm/ui/button";
import { TypographyH1 } from "@ecomm/ui/typography";
import Link from "next/link";
import { Suspense } from "react";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
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
        </div>
        <div className="mb-4">
          <Suspense fallback={<QuerySearchSkeleton />}>
            <QuerySearch />
          </Suspense>
        </div>
        <Suspense fallback={<CategoriesCardsSkeleton />}>
          <CategoriesCards searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
