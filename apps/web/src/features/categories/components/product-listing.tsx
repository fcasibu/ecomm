import type { CategoryDTO } from '@ecomm/services/categories/category-dto';
import { CategoryHeading } from './category-heading';
import { ProductListingContent } from './product-listing-content';
import { Button } from '@ecomm/ui/button';
import { NextLink } from '@/components/link';
import { link } from '@/lib/utils/link-helper';

export function ProductListing({ category }: { category: CategoryDTO }) {
  return (
    <div className="flex flex-col gap-8 py-6">
      <div className="container flex flex-col gap-3">
        <CategoryHeading category={category} />
        <SubCategories subCategories={category.children ?? []} />
      </div>
      <div className="container">
        <ProductListingContent />
      </div>
    </div>
  );
}

const MAX_SUB_CATEGORIES = 6;

function SubCategories({
  subCategories,
}: {
  subCategories: CategoryDTO['children'];
}) {
  return (
    <div className="flex justify-center gap-2 py-2">
      {subCategories.slice(0, MAX_SUB_CATEGORIES).map((subCategory) => (
        <Button
          key={subCategory.id}
          type="button"
          variant="outline"
          className="flex h-full min-w-24 items-center gap-2 rounded-full px-3 py-1 !text-xs hover:no-underline"
          asChild
        >
          <NextLink href={link.category.single(subCategory.slug)} prefetch>
            {subCategory.name}
          </NextLink>
        </Button>
      ))}
    </div>
  );
}
